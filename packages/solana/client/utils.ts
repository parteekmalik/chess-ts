export function u64ToBuffer(value: number | bigint): Buffer {
  let v = typeof value === "number" ? BigInt(value) : value;

  // check that it fits in unsigned 64-bit
  if (v < 0n || v > 0xFFFFFFFFFFFFFFFFn) {
    throw new Error("value must be a valid u64");
  }

  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(v);
  return buf;
}

export function randomU32(): number {
  return (Math.floor(Math.random() * 0x100000000) >>> 0);
}
