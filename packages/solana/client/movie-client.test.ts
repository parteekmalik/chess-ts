import * as web3 from '@solana/web3.js';
import { getKeypairFromFile } from "@solana-developers/helpers";
import { decodeGameAccount, encodeMakeMoveInstruction, MakeMoveSchema, VARIANT_CREATE_GAME, VARIANT_INIT_REGISTRY } from './chess-model';
import { Chess } from 'chess.js';

const CHESS_PROGRAM_ID = new web3.PublicKey(
  '7PuX57gXCaVvUJkHPxBKJp6o6Dv9vtrHQi9WoMGHgaZv'
);

function deriveGamePDA(
  white: web3.PublicKey,
  black: web3.PublicKey,
  id: bigint
): [web3.PublicKey, number] {
  const idBuf = Buffer.alloc(8);
  idBuf.writeBigUInt64LE(id);
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from('clasic'), white.toBuffer(), black.toBuffer(), idBuf],
    CHESS_PROGRAM_ID
  );
}
// helper: derive registry PDA
function deriveRegistryPDA(programId: web3.PublicKey): [web3.PublicKey, number] {
  return web3.PublicKey.findProgramAddressSync([Buffer.from('games_registry')], programId);
}

describe('create game PDA', () => {
  jest.setTimeout(60000);

  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed'
  );

  let white: web3.Keypair;
  let black: web3.Keypair;
  let gamePda: web3.PublicKey;
  let registryPda: web3.PublicKey;
  let nextId: bigint;

  // Jest requires top-level await not allowed, so use beforeAll
  beforeAll(async () => {
    white = await getKeypairFromFile('./white.json');
    black = await getKeypairFromFile('./black.json');
    registryPda = deriveRegistryPDA(CHESS_PROGRAM_ID)[0];

    // initialize registry if not present
    let regAcc = await connection.getAccountInfo(registryPda);
    if (!regAcc) {
      console.log('Registry not found on-chain; creating registry PDA:', registryPda.toBase58());
      const initIx = new web3.TransactionInstruction({
        programId: CHESS_PROGRAM_ID,
        keys: [
          { pubkey: registryPda, isSigner: false, isWritable: true }, // registry PDA (will be created)
          { pubkey: white.publicKey, isSigner: true, isWritable: true }, // payer funds creation
          { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: Buffer.from([VARIANT_INIT_REGISTRY]),
      });

      const tx = new web3.Transaction().add(initIx);
      const sig = await web3.sendAndConfirmTransaction(connection, tx, [white], { commitment: 'confirmed' });
      console.log('initialize_registry tx:', sig);
    } else {
      console.log('Registry already exists:', registryPda.toBase58());
    }
    // ----- log registry data (next_game_id) -----
    regAcc = await connection.getAccountInfo(registryPda);
    if (regAcc && regAcc.data.length >= 8) {
      nextId = regAcc.data.readBigUInt64LE(0);
      gamePda = deriveGamePDA(white.publicKey, black.publicKey, nextId)[0];
      console.log(`Registry next_game_id = ${nextId.toString()}`);
    } else {
      console.log('Registry not found or data too small');
    }
  });


  it('should generate a valid PDA and bump', () => {
    const [pda, bump] = deriveGamePDA(
      white.publicKey,
      black.publicKey,
      nextId,
    );

    expect(pda).toBeInstanceOf(web3.PublicKey);
    expect(typeof bump).toBe('number');
    expect(bump).toBeGreaterThanOrEqual(0);
  });

  it('should be deterministic', () => {
    const [pdaA, bumpA] = deriveGamePDA(
      white.publicKey,
      black.publicKey,
      nextId,
    );
    const [pdaB, bumpB] = deriveGamePDA(
      white.publicKey,
      black.publicKey,
      nextId,
    );

    expect(pdaA.equals(pdaB)).toBe(true);
    expect(bumpA).toBe(bumpB);
  });

  it('create game', async () => {
    // CreateGame instruction
    const ix = new web3.TransactionInstruction({
      programId: CHESS_PROGRAM_ID,
      keys: [
        { pubkey: white.publicKey, isSigner: true, isWritable: true }, // white player
        { pubkey: black.publicKey, isSigner: false, isWritable: true }, // black player
        { pubkey: gamePda, isSigner: false, isWritable: true },
        { pubkey: registryPda, isSigner: false, isWritable: true },
        { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([VARIANT_CREATE_GAME])
    });

    const tx = new web3.Transaction().add(ix);
    const signature = await web3.sendAndConfirmTransaction(connection, tx, [white]);
    expect(typeof signature).toBe('string');

    // Fetch and confirm the Game account was initialized
    const accInfo = await connection.getAccountInfo(gamePda);
    expect(accInfo).not.toBeNull();

    const game = decodeGameAccount(accInfo!.data);
    console.log("gamePda: ", gamePda.toBase58(), "game data: ", game);
    expect(game).not.toBeNull();
    expect(game!.white.equals(white.publicKey)).toBe(true);
    expect(game!.black.equals(black.publicKey)).toBe(true);
    expect(Array.isArray(game!.moves)).toBe(true);
    expect(game!.moves.length).toBe(0);
  }, 20000);

  const movesToBePlayed = "d4 d5 c4 e6 Nf3 Nf6 g3 Be7 Bg2 O-O".split(" ");
  it('check moves', () => {
    const game = new Chess();
    for (const mv of movesToBePlayed) {
      game.move(mv);
    }
    expect(game.history().join(" ")).toBe(movesToBePlayed.join(" "));
  })

  it('make moves', async () => {
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

      const game = decodeGameAccount(accInfo!.data);
      console.log(game);
      expect(game).not.toBeNull();
      expect(Array.isArray(game!.moves)).toBe(true);
      // expect(game!.moves.length).toBe(0);

      turnW = !turnW;
    }
  }, 20000)

  it('check balance', async () => {
    const whiteBalance = await connection.getBalance(white.publicKey);
    const blackBalance = await connection.getBalance(black.publicKey);

    console.log('White balance:', whiteBalance / web3.LAMPORTS_PER_SOL, '  |  Black balance:', blackBalance / web3.LAMPORTS_PER_SOL);

    // you can also add assertions, for example:
    // expect(whiteBalance).to.equal(0);
    // expect(blackBalance).to.equal(0);
  });
});
