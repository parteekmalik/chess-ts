use crate::{
    game_match::{GameMatchCreatePayload, MakeMovePayload},
    profile::ProfilePayload,
};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum ChessInstruction {
    CreateRegistry,
    CreateProfile { payload: ProfilePayload },
    CreateGameMatch { payload: GameMatchCreatePayload },
    JoinGameMatch,
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
            1 => {
                let payload = ProfilePayload::load(rest)?;
                Ok(ChessInstruction::CreateProfile { payload })
            }
            2 => {
                let payload = GameMatchCreatePayload::load(rest)?;
                Ok(ChessInstruction::CreateGameMatch { payload })
            }
            3 => Ok(ChessInstruction::JoinGameMatch),
            4 => {
                let payload = MakeMovePayload::load(rest)?;
                Ok(ChessInstruction::MakeMove {
                    uci_move: payload.uci_move,
                })
            }
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
