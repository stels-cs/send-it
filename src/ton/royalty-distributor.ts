import type { StateInit } from '@ton/core';
import { Address } from '@ton/core';
import { Cell, contractAddress } from '@ton/core';
import { beginCell } from '@ton/core';
import { Dictionary, toNano } from '@ton/core';

// https://github.com/ton-community/royalty-distributor/blob/main/utils/setup.ts

export type RoyaltyDistributionParams = {
  address: Address;
  royaltyPercent: bigint;
}[];

export const packAndValidateRoyaltyDict = (params: RoyaltyDistributionParams, bufferLimit: bigint) => {
  const royaltyDict = Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.BigInt(32));
  const lumpPrice = toNano('0.01');

  let totalPercent = 0n;
  params.forEach((v) => {
    if (v.address.workChain !== 0) {
      throw new Error(`Address ${v.address.toString()} must be in workchain 0`);
    }

    royaltyDict.set(v.address.hash, v.royaltyPercent);
    totalPercent += v.royaltyPercent;

    // NOTE: this is tricky check that we want to do off-chain;
    // idea is that if we set royalty for some members too low, e.g. 0.1%
    // than resulting distribution value from it could be lower
    // than mul price, meaning that we won't have enough funds
    // to cover send
    const val = (bufferLimit * v.royaltyPercent) / 100_000n;

    if (val < lumpPrice) {
      throw new Error('Lowest percent royalty must be higher than lump price');
    }
  });

  if (royaltyDict.size === 0) {
    throw new Error('Royalty dictionary cannot be empty');
  }

  if (royaltyDict.size > 10) {
    throw new Error('Royalty dictionary is too big, maximum size is 10');
  }

  if (totalPercent !== 100_000n) {
    throw new Error(`Total royalty percent must be 100,000, but got ${totalPercent}`);
  }

  return royaltyDict;
};

export type DistributorConfig = {
  royaltyDict: Dictionary<Buffer<ArrayBufferLike>, bigint>;
  trustedAddress: Address;
};

export function distributorConfigToCell(config: DistributorConfig): Cell {
  return beginCell()
    .storeBit(false)
    .storeDict(config.royaltyDict)
    .storeAddress(config.trustedAddress)
    .storeMaybeUint(null, 8)
    .endCell();
}

function deployMessage() {
  return beginCell().storeUint(0x7a2f11d8, 32).endCell();
}

const distributionCodeCell = Cell.fromHex('b5ee9c7241020901000154000114ff00f4a413f4bcf2c80b0102016202080202ce0307020120040601ed3e247c903b513434803d013e9034c00064f5c2c1e48c1b7888e44ce3891508c814903c007233e0d4883d0008f3c5885ba4b3e065b3e0c873c2c1f8b27b553e03c0b880f5cb08f45e23b10c6497c0f83e09dbc40820840ee6b2802e6497c138089bace38417c0f233e142339c33c2dbb260c1bec038c36005000c33f89759f00200953b68bb7ec408d7c0c81ba48c1b781c14c060c1fd219be964238700e90075c2c7c4a8087082a557c11b76cc781448e0c1fd1f1be9440d3a16cc8830002496db7800608061a82f648c1b7820009b48155f070f836705300f8385003a812a05122b9925f03e002a2218307f4866fa5908e2701d70b1f5220820186a0a984c8cf89080122cf0bff01fa0270cf0b6ac971fb00228307f47c6fa5e85f048002da18f21da89a1a401e809f481a6000325a60f24da03c5a3f6b4187a');

export function createNewDistributionContract(cfg: RoyaltyDistributionParams, trustedAddress:Address) {
  const dict = packAndValidateRoyaltyDict(cfg, 1000000000n);
  if (dict.size !== cfg.length) {
    throw new Error('distribution has duplicates addresses');
  }
  const data = distributorConfigToCell({
    royaltyDict: dict,
    trustedAddress: trustedAddress,
  });
  const code = distributionCodeCell;
  const si: StateInit = {
    code,
    data,
  };
  const address = contractAddress(0, si);
  return {
    address,
    message: deployMessage(),
    stateInit: si,
    amount: toNano('0.005'),
  };
}

// export function parseDistributionContractState(code: Cell, data: Cell): RoyaltyDistributionParams {
//   if (!code.hash().equals(distributionCodeCell.hash())) {
//     throw new Error('this is not distribution contract');
//   }
//   const cs = data.beginParse();
//   if (cs.remainingBits < 2) {
//     throw new Error('wring data scheme');
//   }
//   cs.skip(1);
//   try {
//     const dict = cs.loadDict(Dictionary.Keys.Buffer(32), Dictionary.Values.BigInt(32));
//     const keys = dict.keys();
//     return keys.map((key) => ({
//       address: new Address(0, key),
//       royaltyPercent: dict.get(key) ?? 0n,
//     }));
//   } catch {
//     throw new Error(`wring data scheme 2`);
//   }
// }
