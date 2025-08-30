import * as web3 from '@solana/web3.js';
import { Chess } from 'chess.js';
import { CHESS_PROGRAM_ID, connection, getKeyPairs } from './global';
import { encodeMakeMoveInstruction, } from './makeMove';
import { ProfileClass } from './profile';
import { RegistryClass } from './registry';
import { ChessMatchClass } from './gameMatch';

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

describe('playing Match', () => {
  jest.setTimeout(360000);
  const registry = new RegistryClass();
  it('creating registry', async () => {
    await registry.init();
    console.log("registryPda: ", RegistryClass.derivePDA(), registry.data);

    expect(registry.data).not.toBeNull();
    console.log(`Registry data: `, registry.data);
  }, 20000)

  it('creating profile white', async () => {
    const { white } = await getKeyPairs()
    const profile = new ProfileClass(white);
    await profile.init();

    expect(profile.data).not.toBeNull();

    console.log(`profile id: `, ProfileClass.derivePDA(white.publicKey));
    console.log(`profile data: `, profile.data);
  }, 20000)

  it('creating profile black', async () => {
    const { black } = await getKeyPairs()
    const profile = new ProfileClass(black);
    await profile.init();

    expect(profile.data).not.toBeNull();
    console.log(`profile id: `, ProfileClass.derivePDA(black.publicKey));
    console.log(`profile data: `, profile.data);
  }, 20000)

  it('create a match entry and fill entry', async () => {
    const { black, white } = await getKeyPairs()
    const { signature: signatureOfCreate, chessMatch } = await ChessMatchClass.createChessMatch(black, 60000, 1);
    expect(typeof signatureOfCreate).toBe('string');
    console.log("waiting", chessMatch.match);
    const { signature } = await chessMatch.joinChessMatch(white)
    console.log("joined", chessMatch.match);
    expect(typeof signature).toBe('string');
    expect(chessMatch.match.white).not.toBeNull();
    expect(chessMatch.match.black).not.toBeNull();
  }, 40000);

  it('check match fetching', async () => {
    const lastMatch = await ChessMatchClass.getLastMatch()
    expect(lastMatch).not.toBeNull();

    const matches = await ChessMatchClass.getAllMatches();
    expect(Array.isArray(matches)).toBe(true);
    expect(matches.length).toBeGreaterThan(0);
  }, 20000)

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
    const gamePda = await ChessMatchClass.getLastMatch();
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

      const game = new ChessMatchClass(accInfo!.data);
      console.log(game);
      expect(game).not.toBeNull();
      expect(Array.isArray(game.match.moves)).toBe(true);
      // expect(game!.moves.length).toBe(0);

      turnW = !turnW;
    }
  }, 20000)
});
