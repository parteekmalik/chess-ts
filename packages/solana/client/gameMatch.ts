import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { CHESS_PROGRAM_ID, connection, getKeyPairs, VARIANT_CREATE_MATCH, VARIANT_JOIN_MATCH } from "./global";
import { ProfileClass } from "./profile";
import { RegistryClass } from "./registry";
import { ChessMatchCreateInstructionSchema, ChessMatchSchema, ChessMatchType } from "./schemas";
import { randomU32 } from "./utils";

export class ChessMatchClass {
  match: ChessMatchType;
  constructor(data: Uint8Array | ChessMatchType) {
    this.match = !(data instanceof Uint8Array) ? data : ChessMatchClass.deserialize(data);
  }
  update(match: ChessMatchType) {
    this.match = match
  }
  serialize(): Buffer {
    return ChessMatchSchema.encode(this.match);
  }
  static deserialize(buffer: Uint8Array): ChessMatchType {
    const obj = ChessMatchSchema.decode(buffer);

    const whitePk = obj.white ? new PublicKey(obj.white) : null;
    const blackPk = obj.black ? new PublicKey(obj.black) : null;

    return {
      ...obj,
      white: whitePk,
      black: blackPk,
    };
  }
  static async createChessMatch(player: Keypair, baseTime: number, incrementTime: number) {
    const { pda: [matchPda], id, idBuf } = ChessMatchClass.createMatchPDA();
    const [registryPda] = RegistryClass.derivePDA();
    const [playerProfilePda] = ProfileClass.derivePDA(player.publicKey);
    let payload = Buffer.alloc(1000);
    const len = ChessMatchCreateInstructionSchema.encode({ id, base_time_seconds: baseTime, increment_seconds: incrementTime }, payload)
    payload = payload.slice(0, len);
    const data = Buffer.concat([
      Buffer.from([VARIANT_CREATE_MATCH]),
      payload
    ])
    const initIx = new TransactionInstruction({
      programId: CHESS_PROGRAM_ID,
      keys: [
        { pubkey: player.publicKey, isSigner: true, isWritable: true },
        { pubkey: playerProfilePda, isSigner: false, isWritable: true },
        { pubkey: matchPda, isSigner: false, isWritable: true },
        { pubkey: registryPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    });

    const tx = new Transaction().add(initIx);
    const signature = await sendAndConfirmTransaction(connection, tx, [player], { commitment: 'confirmed' });
    const matchAcc = await connection.getAccountInfo(matchPda);
    return { signature, chessMatch: new ChessMatchClass(matchAcc!.data) };
  }
  async joinChessMatch(player: Keypair) {
    const [playerProfilePda] = ProfileClass.derivePDA(player.publicKey);
    const [registryPda] = RegistryClass.derivePDA();
    const { pda: [matchPda] } = ChessMatchClass.deriveMatchPDA(this.match.id);
    const [oponentProfilePda] = ProfileClass.derivePDA(this.match.black ?? this.match.white!);
    const initIx = new TransactionInstruction({
      programId: CHESS_PROGRAM_ID,
      keys: [
        { pubkey: player.publicKey, isSigner: true, isWritable: true },
        { pubkey: playerProfilePda, isSigner: false, isWritable: true },
        { pubkey: oponentProfilePda, isSigner: false, isWritable: true },
        { pubkey: matchPda, isSigner: false, isWritable: true },
        { pubkey: registryPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([VARIANT_JOIN_MATCH]),
    });

    const tx = new Transaction().add(initIx);
    const signature = await sendAndConfirmTransaction(connection, tx, [player], { commitment: 'confirmed' });
    const matchAcc = await connection.getAccountInfo(matchPda);
    this.match = ChessMatchClass.deserialize(matchAcc!.data);
    return { signature, chessMatch: this as ChessMatchClass }
  }
  static async getFilteredMatches(
    white: PublicKey,
    black: PublicKey
  ) {
    return (await connection.getProgramAccounts(CHESS_PROGRAM_ID, {
      filters: [
        // update offsets
        { memcmp: { offset: 0, encoding: "base64", bytes: Buffer.from([2]).toString("base64") } },
        { memcmp: { offset: 6, encoding: "base58", bytes: white.toBase58() } },
        { memcmp: { offset: 39, encoding: "base58", bytes: black.toBase58() } },
        { dataSize: 165 }
      ]
    })).concat(await connection.getProgramAccounts(CHESS_PROGRAM_ID, {
      filters: [
        // update offsets
        { memcmp: { offset: 0, encoding: "base64", bytes: Buffer.from([2]).toString("base64") } },
        { memcmp: { offset: 6, encoding: "base58", bytes: black.toBase58() } },
        { memcmp: { offset: 39, encoding: "base58", bytes: white.toBase58() } },
        { dataSize: 165 }
      ]
    }));
  }
  static async getAllMatches() {
    const accounts = await connection.getProgramAccounts(CHESS_PROGRAM_ID, {
      filters: [
        { memcmp: { offset: 0, encoding: "base64", bytes: Buffer.from([2]).toString("base64") } }
      ]
    });
    return accounts;
  }
  static async getLastMatch() {
    const { white, black } = await getKeyPairs();
    const matches = await ChessMatchClass.getFilteredMatches(white.publicKey, black.publicKey);
    console.log("matches length: ", matches.length)
    return matches[0].pubkey;
  }
  static deriveMatchPDA(id: number | Buffer) {
    const idBuf = typeof id === "number" ? Buffer.alloc(4) : id;
    if (typeof id === "number") idBuf.writeUInt32LE(id, 0);
    return {
      pda: PublicKey.findProgramAddressSync([idBuf], CHESS_PROGRAM_ID),
      id,
      idBuf
    };
  }
  static createMatchPDA() {
    const id = randomU32();
    console.log("created match id: ", id);
    const idBuf = Buffer.alloc(4);
    idBuf.writeUInt32LE(id, 0);
    const pda = PublicKey.findProgramAddressSync([idBuf], CHESS_PROGRAM_ID);
    console.log("game pda: ", pda)
    return {
      pda,
      id,
      idBuf
    };
  }
}