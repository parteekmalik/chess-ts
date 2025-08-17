//! Entrypoint and module declarations.
#![allow(unexpected_cfgs)]
#![deny(clippy::all)]
#![forbid(unsafe_code)]

pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;

use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

use crate::{
    instruction::ChessInstruction,
    processor::{initialize_registry, process_create_game, process_make_move},
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = ChessInstruction::unpack(instruction_data)?;

    match instruction {
        ChessInstruction::CreateGame => {
            msg!("Instruction: CreateGame");
            process_create_game(program_id, accounts)
        }
        ChessInstruction::MakeMove { uci_move } => {
            msg!("Instruction: MakeMove {}", uci_move);
            process_make_move(program_id, accounts, uci_move)
        }
        ChessInstruction::CreateRegistry => {
          msg!("Instruction: CreateRegistry");
          initialize_registry(program_id, accounts)
        }
    }
}
