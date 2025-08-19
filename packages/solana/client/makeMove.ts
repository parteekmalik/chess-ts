import { VARIANT_MAKE_MOVE } from "./global";
import * as borsh from '@coral-xyz/borsh';

export const MakeMoveSchema = borsh.struct([borsh.str('uci_move')]);

export function encodeMakeMoveInstruction(uciMove: string): Buffer {
  const payload = { uci_move: uciMove };

  // << allocate buffer >>
  const buf = Buffer.alloc(100);
  const len = MakeMoveSchema.encode(payload, buf);

  // concat variant + encoded payload
  return Buffer.concat([Buffer.from([VARIANT_MAKE_MOVE]), buf.slice(0, len)]);
}
