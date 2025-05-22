// https://emn178.github.io/online-tools/crc32.html crc32 TON Connect Playground Tools
// shift right 32
const GG_TAG = '0x997fdcc000000000';
export const MAX_UINT_32 = 4294967295;

// https://github.com/ton-blockchain/TEPs/pull/131
export function getQueryId(randomId?: number) {
  if (randomId !== undefined) {
    if (randomId < 0) throw new Error('randomId less than zero');
    if (randomId > MAX_UINT_32) throw new Error('randomId too big, max uint 32');
    return BigInt(GG_TAG) + BigInt(randomId);
  }
  const r = Math.floor(Math.random() * MAX_UINT_32);
  return BigInt(GG_TAG) + BigInt(r);
}
