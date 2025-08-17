//! Instruction types for the chess program.
//! Uses Borsh for instruction serialization.

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{program_error::ProgramError};

/// Program instruction enum (Borsh)
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum ChessInstruction {
    /// CreateGame { white: Pubkey, black: Pubkey }
    CreateGame,

    /// MakeMove { uci_move: String }
    MakeMove {
        uci_move: String,
    },

    // create registry
    CreateRegistry,
}

impl ChessInstruction {
    /// Unpack instruction bytes into ChessInstruction.
    ///
    /// This function first attempts to Borsh-deserialize the whole input as a ChessInstruction.
    /// If that fails, it supports a fallback variant-prefixed encoding:
    ///   [variant: u8][payload: borsh(...)],
    /// where variant = 0 => CreateGame, 1 => MakeMove.
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // Fast path: try to deserialize the whole buffer as a Borsh ChessInstruction
        if let Ok(ix) = ChessInstruction::try_from_slice(input) {
            return Ok(ix);
        }

        // Fallback: variant-prefixed format
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        match variant {
            0 => {
                Ok(ChessInstruction::CreateGame)
            }
            1 => {
                // payload struct for MakeMove
                #[derive(BorshDeserialize)]
                struct MakeMovePayload {
                    uci_move: String,
                }

                let payload = MakeMovePayload::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Ok(ChessInstruction::MakeMove {
                    uci_move: payload.uci_move,
                })
            }
            2 => {
              Ok(ChessInstruction::CreateRegistry)
            }
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
