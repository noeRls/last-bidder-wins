#![allow(clippy::result_large_err)]

use anchor_lang::{prelude::*, solana_program::clock::Clock};
use solana_security_txt::security_txt;

declare_id!("7x5a4DsG7gtWDLyrDUWXqqbzWBc3CpD3vR1vNUD1R8ag");

static MS_PER_SLOT: u64 = 400;
static MAX_TIME_BET_MS: u64 = 1000 * 60 * 60 * 24; // 24h
static SLOTS_TO_WIN: u64 = MAX_TIME_BET_MS / MS_PER_SLOT;

static GLOBAL_STATE_SEED: &[u8] = b"global";

// H2tRSUTkwqXm5Uba6GRqrvPwH5m4ziyBMQYMkNEiqf3H
static FEE_ADDRESS: Pubkey = Pubkey::new_from_array([
    238, 54, 182, 197, 176, 210, 184, 221, 20, 43, 158, 89, 160, 93, 115, 177, 206, 225, 110, 157,
    186, 56, 29, 17, 121, 23, 24, 211, 115, 117, 168, 204,
]);

fn get_slot() -> Result<u64> {
    return Ok(Clock::get()?.slot);
}

security_txt! {
    name: "last-bidder-wins",
    project_url: "https://github.com/noeRls/last-bidder-wins",
    contacts: "email:noe.rivals@gmail.com",
    policy: "https://github.com/noeRls/last-bidder-wins/blob/main/SECURITY.md"
}

#[program]
pub mod bet {
    use super::*;

    pub fn create_deposit(_ctx: Context<CreateDeposit>) -> Result<()> {
        Ok(())
    }

    pub fn bet(ctx: Context<Bet>, bet_amount: u64) -> Result<()> {
        let deposit = &ctx.accounts.deposit_account;
        let bet_state = &mut ctx.accounts.bet_state;
        let fee_amount = ((bet_amount as f64) * 0.01).floor() as u64;

        let total_amount = bet_amount + fee_amount;

        require!(
            deposit.get_lamports() >= total_amount,
            CustomErrors::InsufficientFundsForTransaction
        );
        require!(bet_amount > bet_state.last_bet_value, CustomErrors::TooSmallBet);

        deposit.sub_lamports(total_amount)?;

        **ctx.accounts.fee_address.try_borrow_mut_lamports()? += fee_amount;

        bet_state.add_lamports(bet_amount)?;

        bet_state.last_bet_account = ctx.accounts.bidder.key();
        bet_state.last_bet_value = bet_amount;
        bet_state.win_at_slot = get_slot()? + SLOTS_TO_WIN;
        bet_state.prizepool += bet_amount;

        return Ok(());
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let bet_state = &mut ctx.accounts.bet_state;
        let winner = &mut ctx.accounts.winner;
        require!(
            bet_state.win_at_slot <= get_slot()?,
            CustomErrors::TimeRemaining
        );

        let amount_won = bet_state.prizepool;
        bet_state.sub_lamports(amount_won)?;
        **winner.try_borrow_mut_lamports()? += amount_won;

        ctx.accounts.bet_state.reset();

        return Ok(());
    }

    pub fn setup(ctx: Context<Setup>) -> Result<()> {
        ctx.accounts.bet_state.reset();
        return Ok(());
    }
}

#[error_code]
pub enum CustomErrors {
    #[msg("Not enough sol to complete the transaction")]
    InsufficientFundsForTransaction,

    #[msg("Bet not high enough")]
    TooSmallBet,

    #[msg("Not ready for withdraw, there is some time remaining")]
    TimeRemaining,
}

#[derive(Accounts)]
pub struct Setup<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(init, payer = payer, seeds = [GLOBAL_STATE_SEED], bump, space = 8 + BetState::INIT_SPACE)]
    pub bet_state: Account<'info, BetState>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateDeposit<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,

    #[account(init, space = 8, payer = bidder, seeds = [b"deposit", bidder.key().as_ref()], bump)]
    pub deposit_account: Account<'info, Empty>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Bet<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,

    #[account(mut, seeds = [GLOBAL_STATE_SEED], bump)]
    pub bet_state: Account<'info, BetState>,

    #[account(mut, seeds = [b"deposit", bidder.key().as_ref()], bump, close = bidder)]
    /// CHECK: we are making sure it's a PDA with the seed so we own it.
    pub deposit_account: Account<'info, Empty>,

    #[account(mut, address = FEE_ADDRESS)]
    /// CHECK: this is the fee address, expected to be unchecked
    pub fee_address: UncheckedAccount<'info>,
}

#[account]
pub struct Empty {}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, constraint = winner.key() == bet_state.last_bet_account)]
    pub winner: Signer<'info>,

    #[account(mut, seeds = [GLOBAL_STATE_SEED], bump)]
    pub bet_state: Account<'info, BetState>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct BetState {
    last_bet_account: Pubkey,
    last_bet_value: u64,
    win_at_slot: u64,
    // We do not use the SOL amount on the BetState account because there
    // is extra SOL unrelated to the pricepool: the rent
    prizepool: u64,
}

impl BetState {
    pub fn reset(&mut self) {
        self.last_bet_account = Pubkey::default();
        self.last_bet_value = 0;
        self.win_at_slot = 0;
        self.prizepool = 0;
    }
}
