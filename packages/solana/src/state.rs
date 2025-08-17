use std::str::FromStr;

use borsh::{BorshDeserialize, BorshSerialize};
use chess::{Board, ChessMove, Game};
use solana_program::pubkey::Pubkey;
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Match {
    pub id: u64,
    pub white: Pubkey,
    pub black: Pubkey,
    pub fen: String,
    pub moves: Vec<String>, // UCI moves like "e2e4" or "e7e8q"
}

impl Match {
    pub fn get_space_plus_one(&self) -> usize {
        let id = 8;
        let white = 32usize;
        let black = 32usize;
        let fen = 4 + "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1".len();
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
    pub fn space() -> usize {
        8
    }
    pub fn seed() -> &'static [u8] {
        b"games_registry"
    }
}