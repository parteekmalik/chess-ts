//! Entrypoint and module declarations.
#![allow(unexpected_cfgs)]
#![deny(clippy::all)]
#![forbid(unsafe_code)]

pub mod error;
pub mod game_match;
pub mod instruction;
pub mod processor;
pub mod profile;
pub mod registry;
pub mod utils;

use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

use crate::{
    instruction::ChessInstruction,
    processor::{
        create_game_match, create_player_profile, initialize_registry, join_game_match,
        process_make_move,
    },
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!(
        "process_instruction: Starting with {} bytes of data",
        instruction_data.len()
    );
    let instruction = ChessInstruction::unpack(instruction_data)?;
    msg!(
        "process_instruction: Unpacked instruction: {:?}",
        instruction
    );

    let result = match instruction {
        ChessInstruction::CreateRegistry => {
            msg!("Instruction: CreateRegistry");
            initialize_registry(program_id, accounts)
        }
        ChessInstruction::CreateProfile { payload } => {
            msg!("Instruction: CreateProfile");
            create_player_profile(program_id, accounts, payload)
        }
        ChessInstruction::CreateGameMatch { payload } => {
            msg!("Instruction: CreateGameMatch");
            msg!(
                "About to call create_game_match function with {} accounts",
                accounts.len()
            );
            let result = create_game_match(program_id, accounts, payload);
            msg!("create_game_match function returned: {:?}", result.is_ok());
            if let Err(ref e) = result {
                msg!("create_game_match error: {:?}", e);
            }
            result
        }
        ChessInstruction::JoinGameMatch => {
            msg!("Instruction: JoinGameMatch");
            msg!("About to call join_game_match function");
            let result = join_game_match(program_id, accounts);
            msg!("join_game_match function returned: {:?}", result.is_ok());
            if let Err(ref e) = result {
                msg!("create_game_match error: {:?}", e);
            }
            result
        }
        ChessInstruction::MakeMove { uci_move } => {
            msg!("Instruction: MakeMove {}", uci_move);
            process_make_move(program_id, accounts, uci_move)
        }
    };

    msg!("process_instruction: All instructions processed successfully");
    result
}
