use std::str::FromStr;

use crate::{error::*, helper::time_before_game_ends};
use anchor_lang::prelude::*;
use chess::{ChessMove, Color, Game, GameResult};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq, Eq, InitSpace)]
pub enum MatchStatus {
    Waiting,
    Active,
    Finished,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq, Eq, InitSpace)]
pub enum MatchResult {
    Pending,
    WhiteWin,
    BlackWin,
    Draw,
    Abandoned,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq, Eq, InitSpace)]
pub struct MoveRecord {
    pub ts: i64, // UnixTimestamp in Anchor is just i64

    #[max_len(8)]
    pub san: String, // SAN = Standard Algebraic Notation (max 8 chars for most moves)
}

#[account]
#[derive(InitSpace)]
pub struct ChessMatch {
    pub acc_type: u8,
    pub id: u64,
    pub white: Option<Pubkey>,
    pub black: Option<Pubkey>,

    pub status: MatchStatus,

    pub white_win_rating_change: u8,
    pub black_win_rating_change: u8,

    pub base_time_seconds: u32,
    pub increment_seconds: u32,

    pub result: MatchResult,

    pub ends_at: Option<i64>,
    pub created_at: i64,
    pub matched_at: Option<i64>,
    pub finished_at: Option<i64>,

    #[max_len(128)]
    pub fen: String,
    #[max_len(400)]
    pub moves: Vec<MoveRecord>,
}

impl ChessMatch {
    pub fn initialize(
        &mut self,
        match_id: u64,
        base_time_seconds: u32,
        increment_seconds: u32,
        profile: Pubkey,
    ) {
        self.acc_type = 2;
        self.id = match_id;
        self.white = None;
        self.black = None;
        self.status = MatchStatus::Waiting;
        self.white_win_rating_change = 0;
        self.black_win_rating_change = 0;
        self.base_time_seconds = base_time_seconds;
        self.increment_seconds = increment_seconds;
        self.result = MatchResult::Pending;
        self.created_at = Clock::get().unwrap().unix_timestamp;
        self.matched_at = None;
        self.finished_at = None;
        self.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1".to_string();
        self.moves = Vec::new();

        let slot = Clock::get().unwrap().slot;
        if slot % 2 == 1 {
            self.white = Some(profile);
        } else {
            self.black = Some(profile);
        }
    }

    pub fn join(&mut self, profile: Pubkey) {
        if self.white.is_none() {
            self.white = Some(profile);
        } else {
            self.black = Some(profile);
        }
        self.status = MatchStatus::Active;
        self.matched_at = Some(Clock::get().unwrap().unix_timestamp);
        self.ends_at = Some(time_before_game_ends(
            self.base_time_seconds,
            self.increment_seconds,
            &self.moves,
            self.created_at,
        ));
    }

    pub fn verify_turn(&self, profile: Pubkey) -> Result<()> {
        if self.black.is_none() || self.white.is_none() {
            return Err(ChessError::MatchNotStarted.into());
        }
        let turn = Game::from_str(&self.fen).unwrap().side_to_move();
        match turn {
            Color::White => {
                if self.white.unwrap() != profile {
                    return Err(ChessError::NotYourTurn.into());
                }
            }
            Color::Black => {
                if self.black.unwrap() != profile {
                    return Err(ChessError::NotYourTurn.into());
                }
            }
        }
        Ok(())
    }
    pub fn check_abandonment(&mut self) -> bool {
        if self.moves.is_empty()
            && self.matched_at.is_some()
            && Clock::get().unwrap().unix_timestamp
                > self.matched_at.unwrap() + self.base_time_seconds as i64 / 10
        {
            self.status = MatchStatus::Finished;
            self.finished_at = Some(Clock::get().unwrap().unix_timestamp);
            self.result = MatchResult::Abandoned;
            self.ends_at = None;
            return true;
        }
        false
    }
    pub fn is_game_ended_by_time(&self) -> bool {
        self.ends_at.is_some() && Clock::get().unwrap().unix_timestamp > self.ends_at.unwrap()
    }
    pub fn make_move(&mut self, move_fen_str: String) -> Result<()> {
        let mut game = Game::from_str(&self.fen).unwrap();
        let is_legal =
            game.make_move(ChessMove::from_san(&game.current_position(), &move_fen_str).unwrap());
        if !is_legal {
            return Err(ChessError::IllegalMove.into());
        }
        self.fen = game.current_position().to_string();
        self.moves.push(MoveRecord {
            ts: Clock::get().unwrap().unix_timestamp,
            san: move_fen_str,
        });
        if game.result().is_some() {
            self.status = MatchStatus::Finished;
            self.finished_at = Some(Clock::get().unwrap().unix_timestamp);
            self.ends_at = None;
            match game.result() {
                Some(GameResult::WhiteCheckmates) => {
                    self.result = MatchResult::WhiteWin;
                }
                Some(GameResult::BlackCheckmates) => {
                    self.result = MatchResult::BlackWin;
                }
                Some(GameResult::Stalemate) => {
                    self.result = MatchResult::Draw;
                }
                _ => {
                    return Err(ChessError::NotReachable.into());
                }
            }
        } else {
            self.ends_at = Some(time_before_game_ends(
                self.base_time_seconds,
                self.increment_seconds,
                &self.moves,
                self.created_at,
            ));
        }
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Profile {
    pub acc_type: u8,
    pub wallet: Pubkey,
    pub rating: u32,
    pub wins: u32,
    pub losses: u32,
    pub draws: u32,
    #[max_len(32)]
    pub display_name: String,
    #[max_len(1000)]
    pub matches: Vec<u64>,
}

impl Profile {
    pub fn initialize_profile(&mut self, wallet: Pubkey, display_name: String) {
        self.acc_type = 1;
        self.wallet = wallet;
        self.display_name = display_name;
        self.rating = 0;
        self.wins = 0;
        self.losses = 0;
        self.draws = 0;
        self.matches = Vec::new();
    }
    pub fn reset(&mut self) {
        self.matches = vec![];
        self.draws = 0;
        self.losses = 0;
        self.wins = 0;
        self.rating = 1000;
    }
}

#[account]
#[derive(InitSpace)]
pub struct Registry {
    pub acc_type: u8,
    pub matches_played: u32,
    pub matches_pending: u32,
    pub matches_playing: u32,
}

impl Registry {
    pub fn initialize_registry(&mut self) {
        self.acc_type = 0;
        self.matches_played = 0;
        self.matches_playing = 0;
        self.matches_pending = 0;
    }
}
