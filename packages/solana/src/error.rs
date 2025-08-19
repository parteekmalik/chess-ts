//! Program-specific error codes and conversion to ProgramError.

use solana_program::program_error::ProgramError;
use thiserror::Error;

/// Program errors. Each variant maps to a ProgramError::Custom(u32).
/// Keep codes small and documented.
#[derive(Error, Debug)]
pub enum ChessError {
    #[error("Unauthorized player")]
    Unauthorized, // code 0
    #[error("Not your turn")]
    NotYourTurn, // code 1
    #[error("Move parse failed (invalid UCI)")]
    MoveParseError, // code 2
    #[error("Illegal move in current position")]
    IllegalMove, // code 3
    #[error("Account data too small")]
    AccountDataTooSmall, // code 4
}

impl From<ChessError> for ProgramError {
    fn from(e: ChessError) -> Self {
        use ChessError::*;
        let code = match e {
            Unauthorized => 0,
            NotYourTurn => 1,
            MoveParseError => 2,
            IllegalMove => 3,
            AccountDataTooSmall => 4,
        };
        ProgramError::Custom(code)
    }
}
