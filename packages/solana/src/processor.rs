use borsh::BorshDeserialize;
use borsh::BorshSerialize;
use chess::ChessMove;
use solana_program::clock::Clock;
use solana_program::entrypoint::ProgramResult;
use solana_program::msg;
use solana_program::program::invoke;
use solana_program::program::invoke_signed;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use solana_program::rent::Rent;
use solana_program::sysvar::Sysvar;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    system_instruction,
};

use crate::error::ChessError;
use crate::game_match::ChessMatch;
use crate::game_match::GameMatchCreatePayload;
use crate::game_match::MatchResult;
use crate::game_match::MatchStatus;
use crate::game_match::MoveRecord;
use crate::profile;
use crate::profile::Profile;
use crate::profile::ProfilePayload;
use crate::registry::Registry;
use crate::utils::calculate_rating_changes;
use crate::utils::random_bool;

pub fn initialize_registry(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let acc_iter = &mut accounts.iter();
    let payer_info = next_account_info(acc_iter)?;
    let registry_info = next_account_info(acc_iter)?;
    let system_program_info = next_account_info(acc_iter)?;

    let (expected_registry, bump) = Pubkey::find_program_address(&[Registry::seed()], program_id);
    if expected_registry != *registry_info.key {
        msg!("Registry PDA mismatch",);
        return Err(ProgramError::InvalidArgument);
    }

    if registry_info.lamports() > 0 {
        msg!("Registry already initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    let lamports_required = Rent::get()?.minimum_balance(Registry::space());
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

    let registry = Registry {
        acc_type: Registry::get_acc_type(),
        matches_played: 0,
        matches_pending: 0,
    };
    registry.serialize_updates_state(&mut *registry_info.data.borrow_mut())?;

    Ok(())
}
pub fn create_player_profile(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    payload: ProfilePayload,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let player = next_account_info(account_info_iter)?;
    let player_profile_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let (expected_pda, bump_seed) =
        Pubkey::find_program_address(&[player.key.as_ref(), b"v2"], program_id);
    if expected_pda != *player_profile_account.key {
        msg!("create_player_profile PDA does not match",);
        return Err(ProgramError::InvalidAccountData);
    }

    let player_profile = Profile {
        acc_type: Profile::get_acc_type(),
        wallet: *player.key,
        display_name: payload.name,
        rating: 1000,
        losses: 0,
        wins: 0,
        draws: 0,
        matches: vec![],
    };
    let space = player_profile.space();
    let lamports_required = Rent::get()?.minimum_balance(space);

    let create_ix = system_instruction::create_account(
        player.key,
        player_profile_account.key,
        lamports_required,
        space as u64,
        program_id,
    );
    let signers_seeds: &[&[u8]] = &[player.key.as_ref(), b"v2", &[bump_seed]];
    invoke_signed(
        &create_ix,
        &[
            player.clone(),
            player_profile_account.clone(),
            system_program.clone(),
        ],
        &[signers_seeds],
    )?;

    player_profile.serialize_updates_state(&mut *player_profile_account.data.borrow_mut());

    Ok(())
}
pub fn create_game_match(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    payload: GameMatchCreatePayload,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let player = next_account_info(account_info_iter)?;
    let player_profile_account = next_account_info(account_info_iter)?;
    let game_match_account = next_account_info(account_info_iter)?;
    let registry_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    if !player.is_signer {
        msg!("ERROR: Payer must sign the transaction");
        return Err(ProgramError::MissingRequiredSignature);
    }

    if player_profile_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    if registry_account.owner != program_id {
        msg!("ERROR: Registry account not owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    if registry_account.lamports() == 0 {
        msg!("ERROR: Registry account is not initialized");
        return Err(ProgramError::UninitializedAccount);
    }

    if player_profile_account.lamports() == 0 {
        msg!("ERROR: Profile is not found");
        return Err(ProgramError::UninitializedAccount);
    }

    let (expected_pda, bump_seed) =
        Pubkey::find_program_address(&[&payload.id.to_le_bytes()], program_id);
    if expected_pda != *game_match_account.key {
        msg!("ERROR: create_game_match PDA does not match");
        return Err(ProgramError::InvalidAccountData);
    }

    if game_match_account.lamports() > 0 {
        msg!("ERROR: Chess match is already created",);
        return Err(ProgramError::InvalidAccountData);
    }

    let (white, black) = match random_bool()? {
        true => (Some(*player.key), None),
        false => (None, Some(*player.key)),
    };

    let chess_match = ChessMatch {
        acc_type: ChessMatch::get_acc_type(),
        id: payload.id,
        white,
        black,
        status: MatchStatus::Waiting,
        black_win_rating_change: 0,
        white_win_rating_change: 0,
        base_time_seconds: payload.base_time_seconds,
        increment_seconds: payload.increment_seconds,
        result: MatchResult::Pending,
        created_at: Clock::get()?.unix_timestamp,
        matched_at: None,
        finished_at: None,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1".to_string(),
        moves: vec![],
    };

    let space = chess_match.space();
    let lamports_required = Rent::get()?.minimum_balance(space);
    msg!("Calculated space: {} bytes", space);
    msg!("FEN string length: {} characters", chess_match.fen.len());
    msg!("FEN string: '{}'", chess_match.fen);
    let create_ix = system_instruction::create_account(
        player.key,
        game_match_account.key,
        lamports_required,
        space as u64,
        program_id,
    );
    let signers_seeds: &[&[u8]] = &[&payload.id.to_le_bytes(), &[bump_seed]];
    invoke_signed(
        &create_ix,
        &[
            player.clone(),
            game_match_account.clone(),
            system_program.clone(),
        ],
        &[signers_seeds],
    )?;

    chess_match.serialize_updates_state(&mut *game_match_account.data.borrow_mut())?;

    let mut registry = Registry::load(&*registry_account.data.borrow())?;
    registry.matches_pending += 1;
    registry.serialize_updates_state(&mut *registry_account.data.borrow_mut())?;

    let mut player_profile = Profile::load(&*player_profile_account.data.borrow())?;
    player_profile.matches.push(*game_match_account.key);
    let space_required = player_profile.space() - player_profile_account.data.borrow().len();
    if space_required > 0 {
        let required_lanports = Rent::get()?.minimum_balance(space_required);
        invoke(
            &system_instruction::transfer(
                player.key,
                player_profile_account.key,
                required_lanports,
            ),
            &[player.clone(), player_profile_account.clone()],
        )?;
        player_profile_account.resize(player_profile.space())?;
        player_profile.serialize_updates_state(&mut *player_profile_account.data.borrow_mut());
    }
    Ok(())
}
pub fn join_game_match(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let new_player = next_account_info(account_info_iter)?;
    let new_player_profile = next_account_info(account_info_iter)?;
    let oponent_profile = next_account_info(account_info_iter)?;
    let game_match_account = next_account_info(account_info_iter)?;
    let registry_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    if !new_player.is_signer {
        msg!("Payer must sign the transaction");
        return Err(ProgramError::MissingRequiredSignature);
    }

    if game_match_account.lamports() == 0 {
        msg!("There is no waiting player for a Match");
        return Err(ProgramError::UninitializedAccount);
    }

    if game_match_account.owner != program_id {
        msg!("Game match account not owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    if new_player_profile.lamports() == 0 {
        msg!("New player profile is not initialized");
        return Err(ProgramError::UninitializedAccount);
    }

    if oponent_profile.lamports() == 0 {
        msg!("Opponent profile is not initialized");
        return Err(ProgramError::UninitializedAccount);
    }

    if registry_account.lamports() == 0 {
        msg!("Registry is not initialized");
        return Err(ProgramError::UninitializedAccount);
    }

    msg!("all checks passed.");
    msg!(
        "game_match_account.data.borrow().len(): {:?}",
        game_match_account.data
    );
    msg!(
        "game_match_account.data.borrow().len(): {:?}",
        new_player_profile.data
    );
    let mut chess_match = ChessMatch::load(&*game_match_account.data.borrow())?;
    msg!("chess_match loaded.");

    chess_match.matched_at = Some(Clock::get()?.unix_timestamp);
    chess_match.status = MatchStatus::Active;

    let (white_rating, black_rating) = match chess_match.white {
        Some(_) => {
            msg!(
                "join_game_match: white is set, setting black to {}",
                new_player.key
            );
            chess_match.black = Some(*new_player.key);
            (
                Profile::load(&*oponent_profile.data.borrow())?.rating,
                Profile::load(&*new_player_profile.data.borrow())?.rating,
            )
        }
        None => {
            msg!(
                "join_game_match: white is not set, setting white to {}",
                new_player.key
            );
            chess_match.white = Some(*new_player.key);
            (
                Profile::load(&*new_player_profile.data.borrow())?.rating,
                Profile::load(&*oponent_profile.data.borrow())?.rating,
            )
        }
    };
    let (white_win_rating_change, black_win_rating_change) =
        calculate_rating_changes(white_rating, black_rating, 32);
    chess_match.white_win_rating_change = white_win_rating_change;
    chess_match.black_win_rating_change = black_win_rating_change;
    let space = chess_match.space();
    if space > game_match_account.data_len() {
        let required_lanports = Rent::get()?.minimum_balance(space);
        invoke(
            &system_instruction::transfer(new_player.key, game_match_account.key, required_lanports),
            &[new_player.clone(), game_match_account.clone()],
        )?;
        game_match_account.resize(space)?;
    }
    chess_match.serialize_updates_state(&mut *game_match_account.data.borrow_mut())?;

    let mut registry = Registry::load(&*registry_account.data.borrow())?;
    registry.matches_played += 1;
    registry.matches_pending -= 1;
    registry.serialize_updates_state(&mut *registry_account.data.borrow_mut())?;

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
    let mut chess_match = {
        let data = match_account.data.borrow();
        ChessMatch::load(&data)?
    };

    // auth and turn check
    let player_move = chess_match.turn_key();
    let is_autorized = player.key == &player_move;
    if !is_autorized {
        msg!("Not authorized to play move");
        return Err(ChessError::Unauthorized.into());
    }

    // Reconstruct board by replaying moves from default start
    let mut chess_match_game = chess_match.get_game();

    // parse incoming move
    let uci_trimmed = uci_move.trim();
    let mv_new = ChessMove::from_san(&chess_match.get_board(), uci_trimmed)
        .map_err(|_| ChessError::MoveParseError)?;

    let is_legal = chess_match_game.make_move(mv_new);
    if !is_legal {
        msg!("Illegal move attempted: {}", uci_trimmed);
        return Err(ChessError::IllegalMove.into());
    }
    chess_match.moves.push(MoveRecord {
        san: uci_trimmed.to_string(),
        ts: Clock::get()?.unix_timestamp,
    });
    chess_match.fen = chess_match_game.current_position().to_string();

    let mut serialized = Vec::new();
    chess_match.serialize(&mut serialized).unwrap();
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
