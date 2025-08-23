import { clusterApiUrl, Connection, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { CHESS_PROGRAM_ID, getKeyPairs, VARIANT_INIT_REGISTRY } from './global';
import { RegistrySchema, RegistryType } from './schemas';

const connection = new Connection(
  clusterApiUrl('devnet'),
  'confirmed'
);
export class RegistryClass {
  data!: RegistryType;
  async init() {
    const registryPda = RegistryClass.derivePDA()[0];
    let regAcc = await connection.getAccountInfo(registryPda);
    if (!regAcc) {
      const { white: payer } = await getKeyPairs()
      const initIx = new TransactionInstruction({
        programId: CHESS_PROGRAM_ID,
        keys: [
          { pubkey: payer.publicKey, isSigner: true, isWritable: true },
          { pubkey: registryPda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: Buffer.from([VARIANT_INIT_REGISTRY]),
      });

      const tx = new Transaction().add(initIx);
      await sendAndConfirmTransaction(connection, tx, [payer], { commitment: 'confirmed' });
      regAcc = (await connection.getAccountInfo(registryPda))!;
    }
    this.data = this.deserialize(regAcc.data);
  }
  serialize(): Buffer {
    return RegistrySchema.encode(this.data);
  }
  deserialize(buffer: Uint8Array) {
    return RegistrySchema.decode(buffer) as RegistryType;
  }
  static derivePDA() {
    return PublicKey.findProgramAddressSync([Buffer.from('registry')], CHESS_PROGRAM_ID);
  }
}