import * as web3 from '@solana/web3.js';
import { getKeypairFromFile } from "@solana-developers/helpers";
import { encodeMakeMoveInstruction, } from './makeMove';
import { Chess } from 'chess.js';
import { CHESS_PROGRAM_ID, getKeyPairs, VARIANT_INIT_REGISTRY, VARIANT_MATCH_PLAYER, VARIANT_WAIT_PLAYER } from './global';
import { deriveRegistryPDA } from './registry';
import { createWatingPlayer, createWatingPlayerWithoutCheck, deriveWaitingPDA, getLastMatch, matchWaitingPlayers, matchWaitingPlayersWithoutFullContext } from './waitingPlayer';
import { decodeMatchAccount, deriveGamePDA } from './match';

const connection = new web3.Connection(
  web3.clusterApiUrl('devnet'),
  'confirmed'
);
describe('blances', () => {
  it('check balance', async () => {
    const { black, white } = await getKeyPairs()
    const whiteBalance = await connection.getBalance(white.publicKey);
    const blackBalance = await connection.getBalance(black.publicKey);

    console.log(`White balance(${white.publicKey.toBase58()}):`, whiteBalance / web3.LAMPORTS_PER_SOL, `  |  Black balance(${black.publicKey.toBase58()}):`, blackBalance / web3.LAMPORTS_PER_SOL);

    expect(whiteBalance).toBeGreaterThan(0);
    expect(blackBalance).toBeGreaterThan(0);
  });
})
describe('registry', () => {
  jest.setTimeout(60000);

  it('creating registry', async () => {
    const { white: payer } = await getKeyPairs()
    const registryPda = deriveRegistryPDA()[0];
    let regAcc = await connection.getAccountInfo(registryPda);
    if (!regAcc) {
      const initIx = new web3.TransactionInstruction({
        programId: CHESS_PROGRAM_ID,
        keys: [
          { pubkey: payer.publicKey, isSigner: true, isWritable: true },
          { pubkey: registryPda, isSigner: false, isWritable: true },
          { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: Buffer.from([VARIANT_INIT_REGISTRY]),
      });

      const tx = new web3.Transaction().add(initIx);
      await web3.sendAndConfirmTransaction(connection, tx, [payer], { commitment: 'confirmed' });
      regAcc = await connection.getAccountInfo(registryPda);
    }
    
    expect(regAcc).not.toBeNull();
    const nextId = regAcc!.data.readBigUInt64LE(0);
    console.log(`Registry next_game_id = ${nextId.toString()}`);
  }, 20000)
})

describe('player matching', () => {
  jest.setTimeout(60000);

  let gamePda: web3.PublicKey;
  let registryPda: web3.PublicKey;
  let nextId: bigint;

  it('before all initing', async () => {
    const { black, white } = await getKeyPairs()
    registryPda = deriveRegistryPDA()[0];

    let regAcc = (await connection.getAccountInfo(registryPda))!;
    nextId = regAcc.data.readBigUInt64LE(0);
    gamePda = deriveGamePDA(white.publicKey, black.publicKey, nextId)[0];
  }, 20000);

  it('create a waiting entry and fill entry', async () => {
    const { black, white } = await getKeyPairs()
    const { signature: signatureOfWaiting, accInfo } = await createWatingPlayer({ player: black, connection })
    expect(typeof signatureOfWaiting).toBe('string');
    console.log("waiting", accInfo?.data)
    const signature = await matchWaitingPlayers({ connection, white, black })
    expect(typeof signature).toBe('string');
  }, 20000);

  // it('create a waiting entry and fill entry without full context', async () => {
  //   const { black, white } = await getKeyPairs()
  //   const { signature: signatureOfWaiting, accInfo } = await createWatingPlayer({ player: black, connection })
  //   expect(typeof signatureOfWaiting).toBe('string');
  //   console.log("waiting", accInfo?.data)
  //   const signature = await matchWaitingPlayersWithoutFullContext({ connection, white })
  //   expect(typeof signature).toBe('string');
  // }, 20000);

  // it('multiple requests', async () => {
  //   const { black, white } = await getKeyPairs()
  //   let signatres = [createWatingPlayerWithoutCheck({ player: white, connection }), createWatingPlayerWithoutCheck({ player: black, connection })]

  //   for (const signatre of signatres) {
  //     console.log("signatre", await signatre);
  //     expect(typeof signatre).toBe('string');
  //   }
  // }, 20000)
})

describe('playing Match', () => {
  jest.setTimeout(60000);

  const movesToBePlayed = "d4 d5 c4 e6 Nf3 Nf6 g3 Be7 Bg2 O-O".split(" ");
  it('check moves', () => {
    const game = new Chess();
    for (const mv of movesToBePlayed) {
      game.move(mv);
    }
    expect(game.history().join(" ")).toBe(movesToBePlayed.join(" "));
  })

  it('make moves', async () => {
    const { black, white } = await getKeyPairs()
    const gamePda = await getLastMatch({ white, black, connection });
    let turnW = true;
    for (const mv of movesToBePlayed) {
      const player = turnW ? white : black;
      const ix = new web3.TransactionInstruction({
        programId: CHESS_PROGRAM_ID,
        keys: [
          { pubkey: player.publicKey, isSigner: true, isWritable: true }, // white player
          { pubkey: gamePda, isSigner: false, isWritable: true },
          { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: encodeMakeMoveInstruction(mv)
      });

      const tx = new web3.Transaction().add(ix);
      const signature = await web3.sendAndConfirmTransaction(connection, tx, [player]);
      expect(typeof signature).toBe('string');

      // Fetch and confirm the Game account was initialized
      const accInfo = await connection.getAccountInfo(gamePda);
      expect(accInfo).not.toBeNull();

      const game = decodeMatchAccount(accInfo!.data);
      console.log(game);
      expect(game).not.toBeNull();
      expect(Array.isArray(game!.moves)).toBe(true);
      // expect(game!.moves.length).toBe(0);

      turnW = !turnW;
    }
  }, 20000)
});
