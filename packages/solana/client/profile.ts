import { Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { CHESS_PROGRAM_ID, connection, VARIANT_PLAYER_PROFILE } from './global';
import { ProfileCreateInstructionSchema, ProfileSchema, ProfileType, RegistrySchema } from './schemas';

export class ProfileClass {
  data!: ProfileType;
  player: Keypair;
  constructor(player: Keypair) {
    this.player = player
  }
  calculateBufferSize() {

  }
  async init() {
    const player = this.player;
    const profilePda = ProfileClass.derivePDA(player.publicKey)[0];
    let playerAcc = await connection.getAccountInfo(profilePda);

    // Force recreation of profile accounts to fix compatibility with new program
    if (playerAcc && playerAcc.data.length === 384) {
      console.log("Found old profile account (384 bytes), forcing recreation...");
      playerAcc = null; // Force recreation
    }

    if (!playerAcc) {
      let data = Buffer.alloc(1000);
      const len = ProfileCreateInstructionSchema.encode({ name: "newplayer" + Math.floor(Math.random() * 100) }, data)
      data = data.slice(0, len);
      const initIx = new TransactionInstruction({
        programId: CHESS_PROGRAM_ID,
        keys: [
          { pubkey: player.publicKey, isSigner: true, isWritable: true },
          { pubkey: profilePda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: Buffer.concat([
          Buffer.from([VARIANT_PLAYER_PROFILE]),
          data,
        ]),
      });

      const tx = new Transaction().add(initIx);
      await sendAndConfirmTransaction(connection, tx, [player], { commitment: 'confirmed' });
      playerAcc = (await connection.getAccountInfo(profilePda))!;
    }
    this.data = this.deserialize(playerAcc.data);
  }
  serialize(): Buffer {
    const buf = Buffer.alloc(1000);
    const len = ProfileCreateInstructionSchema.encode(this.data, buf)
    return Buffer.concat([Buffer.from([VARIANT_PLAYER_PROFILE]), buf.slice(0, len)]);
  }
  deserialize(buffer: Uint8Array) {
    return ProfileSchema.decode(buffer) as ProfileType;
  }
  static derivePDA(player: PublicKey) {
    return PublicKey.findProgramAddressSync([player.toBuffer(), Buffer.from('v2')], CHESS_PROGRAM_ID);
  }
}