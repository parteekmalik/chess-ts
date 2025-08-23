use std::str::FromStr;

use borsh::{BorshDeserialize, BorshSchema, BorshSerialize};
use chess::{Board, Game};
use solana_program::{clock::UnixTimestamp, program_error::ProgramError, pubkey::Pubkey};

#[derive(BorshSerialize, BorshDeserialize, BorshSchema, Debug, Clone)]
#[borsh(use_discriminant = true)]
#[repr(u8)]
pub enum MatchStatus {
    Waiting = 0,   // opponent empty, open for matchmaking
    Active = 1,    // both players present, ongoing
    Finished = 2,  // finished and result stored
    Cancelled = 3, // aborted / creator cancelled
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub enum MatchResult {
    Pending,
    WhiteWin,
    BlackWin,
    Draw,
    Abandoned, // timeout / disconnect
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct MoveRecord {
    pub ts: UnixTimestamp,
    pub san: String, // SAN = Standard Algebraic Notation
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct ChessMatch {
    pub acc_type: u8,
    pub id: u32,
    pub white: Option<Pubkey>,
    pub black: Option<Pubkey>,

    pub status: MatchStatus,

    pub white_win_rating_change: u8,
    pub black_win_rating_change: u8,

    pub base_time_seconds: u32,
    pub increment_seconds: u32,

    pub result: MatchResult,

    pub created_at: UnixTimestamp,
    pub matched_at: Option<UnixTimestamp>,
    pub finished_at: Option<UnixTimestamp>,

    pub fen: String,
    pub moves: Vec<MoveRecord>,
}

impl ChessMatch {
    pub fn load(data: &[u8]) -> Result<ChessMatch, std::io::Error> {
        Self::try_from_slice(data)
    }
    pub fn serialize_updates_state(&self, data: &mut [u8]) -> Result<(), ProgramError> {
        let mut serialized = Vec::new();
        self.serialize(&mut serialized)?;

        data[..serialized.len()].copy_from_slice(&serialized);

        Ok(())
    }
    pub fn space(&self) -> usize {
        let mut serialized = Vec::new();
        self.serialize(&mut serialized).unwrap();
        serialized.len()
    }
    pub fn turn_key(&self) -> Pubkey {
        match self.get_game().side_to_move() {
            chess::Color::Black => self.black.unwrap(),
            chess::Color::White => self.white.unwrap(),
        }
    }
    pub fn get_game(&self) -> Game {
        Game::from_str(&self.fen).expect("Invalid FEN string")
    }
    pub fn get_board(&self) -> Board {
        self.get_game().current_position()
    }
    pub fn get_acc_type() -> u8 {
        2
    }
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct GameMatchCreatePayload {
    pub id: u32,
    pub base_time_seconds: u32,
    pub increment_seconds: u32,
}
impl GameMatchCreatePayload {
    pub fn load(data: &[u8]) -> Result<Self, ProgramError> {
        Self::try_from_slice(data).map_err(|_| ProgramError::InvalidAccountData)
    }
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct MakeMovePayload {
    pub uci_move: String,
}
impl MakeMovePayload {
    pub fn load(data: &[u8]) -> Result<Self, ProgramError> {
        Self::try_from_slice(data).map_err(|_| ProgramError::InvalidAccountData)
    }
}
