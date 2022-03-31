use anchor_lang::prelude::*;

declare_id!("m3wFLC2AiGxbLaqBJjihB9WkZMNsZkhx86a9Euv9mHx");

#[program]
pub mod joketoearn {
    use super::*;
    pub fn create_joke(ctx: Context<CreateJokeCtx>, joke_content: String) -> Result<()> {
        let joke: &mut Account<Joke> = &mut ctx.accounts.joke_account;
        joke.author = *ctx.accounts.authority.key;
        joke.content = joke_content;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateJokeCtx<'info> {
    #[account(init, payer = authority, space = 2000)]
    pub joke_account: Account<'info, Joke>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(address = anchor_lang::solana_program::system_program::ID)]
    pub system_program: Program<'info, System>
}

#[account]
pub struct Joke {
    pub author: Pubkey,  // this is the authority we worked so hard to get earlier
    pub content: String,
}