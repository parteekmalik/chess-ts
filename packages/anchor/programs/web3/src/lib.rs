// #![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
pub mod state;
use crate::state::*;
pub mod error;
use crate::error::*;
pub mod helper;

declare_id!("2yPLmwjdWoBuX5jca96tjfxGL2wAPNfHQEyCMAcABcyU");

#[program]
pub mod web3 {

    use super::*;

    pub fn initialize_registry(ctx: Context<InitializeRegistry>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.initialize_registry();
        Ok(())
    }
    pub fn initialize_profile(ctx: Context<InitializeProfile>, name: String) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        profile.initialize_profile(ctx.accounts.payer.key(), name);
        Ok(())
    }

    pub fn clean_profile(ctx: Context<CleanProfile>) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        profile.reset();
        Ok(())
    }

    pub fn create_chess_match(
        ctx: Context<CreateChessMatch>,
        match_id: u64,
        base_time_seconds: u32,
        increment_seconds: u32,
    ) -> Result<()> {
        let chess_match = &mut ctx.accounts.chess_match;
        chess_match.initialize(
            match_id,
            base_time_seconds,
            increment_seconds,
            ctx.accounts.profile.key(),
        );

        ctx.accounts.registry.matches_pending = ctx
            .accounts
            .registry
            .matches_pending
            .checked_add(1)
            .unwrap();
        ctx.accounts
            .profile
            .matches
            .push(ctx.accounts.chess_match.id);
        Ok(())
    }

    pub fn join_chess_match(ctx: Context<JoinChessMatch>) -> Result<()> {
        let chess_match = &mut ctx.accounts.chess_match;
        if chess_match.white.is_some() && chess_match.black.is_some() {
            return Err(ChessError::MatchAlreadyFull.into());
        }

        chess_match.join(ctx.accounts.player_profile.key());

        ctx.accounts.registry.matches_playing = ctx
            .accounts
            .registry
            .matches_playing
            .checked_add(1)
            .unwrap();
        ctx.accounts.registry.matches_pending = ctx
            .accounts
            .registry
            .matches_pending
            .checked_sub(1)
            .unwrap();
        ctx.accounts
            .player_profile
            .matches
            .push(ctx.accounts.chess_match.id);

        Ok(())
    }

    pub fn close_chess_match(_ctx: Context<CloseChessMatch>) -> Result<()> {
        Ok(())
    }

    pub fn make_move(ctx: Context<MakeMove>, move_fen_str: String) -> Result<()> {
        let chess_match = &mut ctx.accounts.chess_match;
        if chess_match.status != MatchStatus::Active {
            return Err(ChessError::MatchNotActiveOrFinished.into());
        }
        chess_match.verify_turn(ctx.accounts.player_profile.key())?;
        if chess_match.check_abandonment() {
            return Err(ChessError::MatchAbandoned.into());
        }
        if chess_match.is_game_ended_by_time() {
            return Err(ChessError::MatchTimeOut.into());
        }
        chess_match.make_move(move_fen_str)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space = 8 + Registry::INIT_SPACE,
        payer = payer,
        seeds = [b"registry"],
        bump
    )]
    pub registry: Account<'info, Registry>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeProfile<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space = 8 + Profile::INIT_SPACE,
        payer = payer,
        seeds = [payer.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Profile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CleanProfile<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut, seeds = [payer.key().as_ref()], bump)]
    pub profile: Account<'info, Profile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(match_id: u64)]
pub struct CreateChessMatch<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space = 8 + ChessMatch::INIT_SPACE,
        payer = payer,
        seeds = [match_id.to_le_bytes().as_ref()],
        bump
    )]
    pub chess_match: Account<'info, ChessMatch>,

    #[account(mut,seeds = [b"registry"], bump)]
    pub registry: Account<'info, Registry>,
    #[account(mut,seeds = [payer.key().as_ref()], bump)]
    pub profile: Account<'info, Profile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinChessMatch<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub chess_match: Account<'info, ChessMatch>,
    #[account(mut,seeds = [b"registry"], bump)]
    pub registry: Account<'info, Registry>,
    #[account(mut,seeds = [payer.key().as_ref()], bump)]
    pub player_profile: Account<'info, Profile>,
}

#[derive(Accounts)]
pub struct CloseChessMatch<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut,close = payer)]
    pub chess_match: Account<'info, ChessMatch>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MakeMove<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut,seeds = [chess_match.id.to_le_bytes().as_ref()], bump)]
    pub chess_match: Account<'info, ChessMatch>,
    #[account(mut,seeds = [b"registry"], bump)]
    pub registry: Account<'info, Registry>,
    #[account(mut,seeds = [payer.key().as_ref()], bump)]
    pub player_profile: Account<'info, Profile>,
    #[account(mut)]
    pub opponent_profile: Account<'info, Profile>,
    pub system_program: Program<'info, System>,
}
