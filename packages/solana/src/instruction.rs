use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;

/// Program instruction enum (Borsh)
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum ChessInstruction {
    CreateRegistry,
    CreateWaitingForMatch,
    MatchWaitingPlayer,
    MakeMove { uci_move: String },
}

impl ChessInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        if let Ok(ix) = ChessInstruction::try_from_slice(input) {
            return Ok(ix);
        }

        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        match variant {
            0 => Ok(ChessInstruction::CreateRegistry),
            1 => Ok(ChessInstruction::CreateWaitingForMatch),
            2 => Ok(ChessInstruction::MatchWaitingPlayer),
            3 => {
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
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
