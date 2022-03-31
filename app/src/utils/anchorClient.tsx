import { Connection } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { programAddress, connectionsOptions } from './config';


const getConnectionProvider = async (wallet, network) => {
  const connection = new Connection(
    network,
    connectionsOptions.preflightCommitment
  );
  const provider = new Provider(
    connection,
    wallet,
    connectionsOptions.preflightCommitment
  );
  return provider;
};

const getProgram = async (wallet, network) => {
  // Get a connection
  const provider = await getConnectionProvider(wallet, network);
  // Get metadata about your solana program
  // const idl = await Program.fetchIdl(programAddress, provider);
  const idl = {
    "version": "0.1.0",
    "name": "joketoearn",
    "instructions": [
      {
        "name": "createJoke",
        "accounts": [
          {
            "name": "jokeAccount",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "jokeContent",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Joke",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "author",
              "type": "publicKey"
            },
            {
              "name": "content",
              "type": "string"
            }
          ]
        }
      }
    ],
    "metadata": {
      "address": "m3wFLC2AiGxbLaqBJjihB9WkZMNsZkhx86a9Euv9mHx"
    }
  }
  // Create a program that you can call
  return new Program(idl, programAddress, provider);
};

const fetchJokes = async (wallet, network) => {
  const program = await getProgram(wallet, network);
  const jokes = await program.account.joke.all();
  return jokes;
}

const sendJoke = async (wallet, network, joke) => {
  const program = await getProgram(wallet, network);
  const jokeAccountKeypair = web3.Keypair.generate()
  console.log(program)
  console.log(jokeAccountKeypair)
  // Craft the createJoke Instruction
  const tx = await program.rpc.createJoke(joke, {
    accounts: {
      jokeAccount: jokeAccountKeypair.publicKey,
      authority: program.provider.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [jokeAccountKeypair]
  });
  console.log(tx);
}

export {
  fetchJokes,
  sendJoke,
};