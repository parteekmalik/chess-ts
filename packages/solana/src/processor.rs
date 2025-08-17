//! Instruction processor: handle CreateGame and MakeMove.
//! Uses the `chess` crate for board & move validation (version 3.2.0).

use borsh::BorshDeserialize;
use borsh::BorshSerialize;
use solana_program::program::invoke;
use solana_program::program::invoke_signed;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

use crate::error::ChessError;
use crate::state::Match;
use crate::state::Registry;

use chess::ChessMove;

pub fn initialize_registry(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let acc_iter = &mut accounts.iter();
    let registry_info = next_account_info(acc_iter)?;
    let payer_info = next_account_info(acc_iter)?;
    let system_program_info = next_account_info(acc_iter)?;

    // verify PDA
    let (expected_registry, bump) = Pubkey::find_program_address(&[Registry::seed()], program_id);
    if expected_registry != *registry_info.key {
        msg!("Registry PDA mismatch");
        return Err(ProgramError::InvalidArgument);
    }

    // Ensure registry is not already initialized
    if registry_info.lamports() > 0 {
        msg!("Registry already initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    // create account
    let rent = Rent::get()?;
    let lamports_required = rent.minimum_balance(Registry::space());

    let create_ix = system_instruction::create_account(
        payer_info.key,
        registry_info.key,
        lamports_required,
        Registry::space() as u64,
        program_id,
    );

    let seeds: &[&[u8]] = &[Registry::seed(), &[bump]];
    invoke_signed(
        &create_ix,
        &[
            payer_info.clone(),
            registry_info.clone(),
            system_program_info.clone(),
        ],
        &[seeds],
    )?;

    // initialize next_game_id = 0
    let registry = Registry { next_game_id: 0 };
    registry
        .serialize(&mut *registry_info.try_borrow_mut_data()?)
        .map_err(|_| ProgramError::InvalidAccountData)?;

    msg!("Registry initialized at {}", registry_info.key);
    Ok(())
}

pub fn process_create_game(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let white = next_account_info(account_info_iter)?;
    let black = next_account_info(account_info_iter)?;
    let game_account = next_account_info(account_info_iter)?;
    let registry_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;
    let white_key = *white.key;
    let black_key = *black.key;

    // Signer check
    if !white.is_signer {
        msg!("Payer (white) must sign the transaction");
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut registry: Registry = Registry::try_from_slice(&registry_account.data.borrow())?;
    let current_id = registry.next_game_id;
    msg!("Registry next_game_id = {}", current_id);

    let id_bytes = current_id.to_le_bytes();

    // Derive expected PDA
    let (expected_pda, bump_seed) = Pubkey::find_program_address(
        &[
            Match::seed(),
            white.key.as_ref(),
            black.key.as_ref(),
            &id_bytes,
        ],
        program_id,
    );
    if expected_pda != *game_account.key {
        msg!("Error: game account does not match PDA");
        return Err(ProgramError::InvalidAccountData);
    }

    // 3) Ensure account not already initialized
    if game_account.lamports() > 0 {
        msg!("Game account already exists");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    // Compute size and rent
    let space = Match::space_with_zero_moves();
    let rent = Rent::get()?;
    let lamports_required = rent.minimum_balance(space);

    // Create the account (via PDA) with CPI and PDA-derived signer
    let create_ix = system_instruction::create_account(
        white.key,
        game_account.key,
        lamports_required,
        space as u64,
        program_id,
    );

    let pda_seeds: &[&[_]] = &[
        Match::seed(),
        white.key.as_ref(),
        black.key.as_ref(),
        &id_bytes,
        &[bump_seed],
    ];

    invoke_signed(
        &create_ix,
        &[white.clone(), game_account.clone(), system_program.clone()],
        &[pda_seeds],
    )?;

    // Initialize Game struct and write serialized bytes
    let clasic_match = Match {
        id: current_id,
        white: white_key,
        black: black_key,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1".to_string(),
        moves: Vec::new(),
    };

    // Serialize into buffer that fits the space
    let mut serialized = Vec::with_capacity(space);
    clasic_match
        .serialize(&mut serialized)
        .map_err(|_| ProgramError::InvalidAccountData)?;

    if serialized.len() > game_account.data_len() {
        msg!(
            "Serialized game size {} exceeds allocated space {}",
            serialized.len(),
            game_account.data_len()
        );
        return Err(ChessError::AccountDataTooSmall.into());
    }

    // Write data
    let data = &mut *game_account.data.borrow_mut();
    data[..serialized.len()].copy_from_slice(&serialized);
    for b in data[serialized.len()..].iter_mut() {
        *b = 0;
    }

    msg!(
        "Game account {} created (space={}, lamports={})",
        game_account.key,
        space,
        lamports_required
    );

    // --- update registry struct ---
    registry.next_game_id += 1;
    // serialize registry back into the account
    registry
        .serialize(&mut *registry_account.try_borrow_mut_data()?)
        .map_err(|_| ProgramError::InvalidAccountData)?;

    msg!("Registry next_game_id updated to {}", registry.next_game_id);

    Ok(())
}

pub fn process_make_move(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    uci_move: String,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let player = next_account_info(account_info_iter)?;
    let match_account = next_account_info(account_info_iter)?;

    // signer check
    if !player.is_signer {
        msg!("Player must sign");
        return Err(ProgramError::MissingRequiredSignature);
    }

    // owner check
    if match_account.owner != program_id {
        msg!("Game account not owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize game
    let mut clasic_match: Match = {
        let data = match_account.data.borrow();
        Match::try_from_slice(&data).map_err(|_| ProgramError::InvalidAccountData)?
    };

    // auth and turn check
    let player_move = clasic_match.turn_key();
    let is_autorized = player.key == &player_move;
    if !is_autorized {
        msg!("Not authorized to play move");
        return Err(ChessError::Unauthorized.into());
    }

    // Reconstruct board by replaying moves from default start
    let mut clasic_match_game = clasic_match.get_game();

    // parse incoming move
    let uci_trimmed = uci_move.trim();
    let mv_new = ChessMove::from_san(&clasic_match.get_board(), uci_trimmed)
        .map_err(|_| ChessError::MoveParseError)?;

    let legat = clasic_match_game.make_move(mv_new);
    if !legat {
        msg!("Illegal move attempted: {}", uci_trimmed);
        return Err(ChessError::IllegalMove.into());
    }
    clasic_match.moves.push(uci_trimmed.to_string());
    clasic_match.fen = clasic_match_game.current_position().to_string();

    let mut serialized = Vec::new();
    clasic_match
        .serialize(&mut serialized)
        .map_err(|_| ProgramError::InvalidAccountData)?;
    let new_size = serialized.len();

    if new_size > match_account.data_len() {
        msg!(
            "Resizing account from {} to {} bytes",
            match_account.data_len(),
            new_size
        );

        let rent = Rent::get()?;
        let lamports_required = rent
            .minimum_balance(new_size)
            .saturating_sub(match_account.lamports());

        msg!("lanports required {}", lamports_required);
        // Fund the account first (must happen before resizing)
        if lamports_required > 0 {
            invoke(
                &system_instruction::transfer(player.key, match_account.key, lamports_required),
                &[player.clone(), match_account.clone()],
            )?;
        }
        msg!("transfered lanports");
        // Resize the PDA account (replaces allocate/assign/realloc)
        match_account.resize(new_size)?;

        msg!("resized account");
    }
    
    match_account.data.borrow_mut()[..new_size].copy_from_slice(&serialized);

    msg!("Move '{}' accepted and stored.", uci_trimmed);
    Ok(())
}
