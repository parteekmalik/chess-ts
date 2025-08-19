import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { CHESS_PROGRAM_ID, VARIANT_MATCH_PLAYER, VARIANT_WAIT_PLAYER } from "./global";
import { deriveRegistryPDA } from "./registry";
import { deriveGamePDA } from "./match";

export function deriveWaitingPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('waiting_player')], CHESS_PROGRAM_ID);
}

export async function createWatingPlayer(ctx: { player: Keypair, connection: Connection }) {
  const { player, connection } = ctx;
  const [waitingMatchPDA] = deriveWaitingPDA();
  let accInfo = await connection.getAccountInfo(waitingMatchPDA);
  if (!accInfo || (accInfo && !accInfo.data.readUInt8(0))) {
    const ix = new TransactionInstruction({
      programId: CHESS_PROGRAM_ID,
      keys: [
        { pubkey: player.publicKey, isSigner: true, isWritable: true },
        { pubkey: waitingMatchPDA, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([VARIANT_WAIT_PLAYER])
    });

    const tx = new Transaction().add(ix);
    const signature = await sendAndConfirmTransaction(connection, tx, [player]);
    return { signature, accInfo: (await connection.getAccountInfo(waitingMatchPDA))! };
  } else {
    return { accInfo };
  }
}

export async function matchWaitingPlayers(ctx: { white: Keypair, black: Keypair, connection: Connection }) {
  const { black, white, connection } = ctx;
  const [waitingMatchPDA] = deriveWaitingPDA();
  const [registryPda] = deriveRegistryPDA();
  const regAcc = (await connection.getAccountInfo(registryPda))!;
  const nextId = regAcc.data.readBigUInt64LE(0);
  const [gamePda] = deriveGamePDA(white.publicKey, black.publicKey, nextId);
  const ix = new TransactionInstruction({
    programId: CHESS_PROGRAM_ID,
    keys: [
      { pubkey: white.publicKey, isSigner: true, isWritable: true },
      { pubkey: black.publicKey, isSigner: false, isWritable: true },
      { pubkey: gamePda, isSigner: false, isWritable: true },
      { pubkey: registryPda, isSigner: false, isWritable: true },
      { pubkey: waitingMatchPDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: Buffer.from([VARIANT_MATCH_PLAYER])
  });

  const tx = new Transaction().add(ix);
  const signature = await sendAndConfirmTransaction(connection, tx, [white]);
  return signature;
}

export async function getLastMatch(ctx: { white: Keypair, black: Keypair, connection: Connection }) {
  const { connection, white, black } = ctx;
  const [registryPda] = deriveRegistryPDA();
  const regAcc = (await connection.getAccountInfo(registryPda))!;
  const nextId = regAcc.data.readBigUInt64LE(0);
  const [gamePda] = deriveGamePDA(white.publicKey, black.publicKey, nextId - 1n);
  return gamePda;
}