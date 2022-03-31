import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Joketoearn } from "../target/types/joketoearn";

describe("joketoearn", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Joketoearn as Program<Joketoearn>;

  it('It Creates a Joke!', async () => {
    // Create an address for the soon-to-be created Account
    let jokeAccountKeypair = anchor.web3.Keypair.generate()

    // Craft the createJoke Instruction
    let tx = await program.rpc.createJoke('Not funny..', {
      accounts: {
        jokeAccount: jokeAccountKeypair.publicKey,
        authority: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [jokeAccountKeypair]
    });

    jokeAccountKeypair = anchor.web3.Keypair.generate()
    tx = await program.rpc.createJoke('Funny..', {
      accounts: {
        jokeAccount: jokeAccountKeypair.publicKey,
        authority: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [jokeAccountKeypair]
    });

    // console.log("Your transaction signature", tx);
    const jokes = await program.account.joke.all();
    console.log(jokes);
  });
});
