use std::str::FromStr;

use borsh::{BorshDeserialize, BorshSerialize};
use chess::{Board, Game};
use solana_program::{program_error::ProgramError, pubkey::Pubkey};
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Match {
    pub id: u64,
    pub white: Pubkey,
    pub black: Pubkey,
    pub fen: String,
    pub moves: Vec<String>, // UCI moves like "e2e4" or "e7e8q"
}

impl Match {
    pub fn serialize_updates_state(&self, data: &mut [u8]) {
        let mut serialized = Vec::with_capacity(WaitingPlayer::space());
        self.serialize(&mut serialized)
            .map_err(|_| ProgramError::InvalidAccountData)
            .unwrap();

        data[..serialized.len()].copy_from_slice(&serialized);
        for b in data[serialized.len()..].iter_mut() {
            *b = 0;
        }
    }
    pub fn get_space_plus_one(&self) -> usize {
        let id = 8;
        let white = 32usize;
        let black = 32usize;
        let fen = 4 + self.fen.len();
        let max_move_len = 5usize; // e.g. "e7e8q"
        let moves_region = 4usize + (self.moves.len() + 1) * (4 + max_move_len);
        id + white + black + fen + moves_region
    }
    pub fn space_with_zero_moves() -> usize {
        let id = 8;
        let white = 32usize;
        let black = 32usize;
        let fen = 4 + "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1".len();
        let moves_region = 4usize;
        id + white + black + fen + moves_region
    }
    pub fn turn_key(&self) -> Pubkey {
        match self.get_game().side_to_move() {
            chess::Color::Black => self.black,
            chess::Color::White => self.white,
        }
    }
    pub fn get_game(&self) -> Game {
        Game::from_str(&self.fen).expect("Invalid FEN string")
    }
    pub fn get_board(&self) -> Board {
        self.get_game().current_position()
    }
    pub fn seed() -> &'static [u8] {
        b"clasic"
    }
}

// Registry holds global state for your program.
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Registry {
    pub next_game_id: u64,
}

impl Registry {
    pub fn serialize_updates_state(&self, data: &mut [u8]) {
        let mut serialized = Vec::with_capacity(WaitingPlayer::space());
        self.serialize(&mut serialized)
            .map_err(|_| ProgramError::InvalidAccountData)
            .unwrap();

        data[..serialized.len()].copy_from_slice(&serialized);
        for b in data[serialized.len()..].iter_mut() {
            *b = 0;
        }
    }
    pub fn space() -> usize {
        8
    }
    pub fn get_pda(program_id: &Pubkey) -> (Pubkey, u8) {
        Pubkey::find_program_address(&[Registry::seed()], program_id)
    }
    pub fn seed() -> &'static [u8] {
        b"games_registry"
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct WaitingPlayer {
    pub player: Option<Pubkey>,
}

impl WaitingPlayer {
    pub fn serialize_updates_state(&self, data: &mut [u8]) {
        let mut serialized = Vec::with_capacity(WaitingPlayer::space());
        self.serialize(&mut serialized)
            .map_err(|_| ProgramError::InvalidAccountData)
            .unwrap();

        data[..serialized.len()].copy_from_slice(&serialized);
        for b in data[serialized.len()..].iter_mut() {
            *b = 0;
        }
    }
    pub fn space() -> usize {
        1 + 32usize
    }
    pub fn get_pda(program_id: &Pubkey) -> (Pubkey, u8) {
        Pubkey::find_program_address(&[WaitingPlayer::seed()], program_id)
    }
    pub fn seed() -> &'static [u8] {
        b"waiting_player"
    }
}
