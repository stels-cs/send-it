import { Address, beginCell, toNano } from "@ton/core";
import { z } from "zod/v4";
import { TemplateType } from "@/templates/type";
import { getQueryId } from "@/ton/getQueryId";
import { createDefaultTonTransaction } from "@/ton/createDefaultTonTransaction";

const Parser = z.object({
  nftAddress: z.string().meta({
    title: 'Ton dns address',
  }),
  walletAddress: z.string().optional().meta({
    title: 'Wallet address',
  }),
})

export const TonDNSSetWallet: TemplateType = {
  id: 'TonDNSSetWallet',
  name: "TON DNS set wallet",
  description: "Setup wallet address for ton dns like nft for resolving",
  schema: z.toJSONSchema(Parser, {target:"draft-7"}),
  toTx: async (input: object) => {
    const data = Parser.parse(input);
    const body = beginCell()
      .storeUint(0x4eb1f0f9,32)
      .storeUint(getQueryId(), 64)
      .storeUint(BigInt('0xe8d44050873dba865aa7c170ab4cce64d90839a34dcfd6cf71d14e0205443b1b'), 256);
    if (data.walletAddress) {
      const record = beginCell().storeUint(0x9fd3, 16)
        .storeAddress(Address.parse(data.walletAddress))
        .storeUint(0, 8)
        .endCell();
      body.storeRef(record)
    }

    // https://github.com/ton-blockchain/ton/blob/7e3df93ca2ab336716a230fceb1726d81bac0a06/crypto/block/block.tlb#L827
    return createDefaultTonTransaction({
      to: Address.parse(data.nftAddress),
      amount: toNano('0.05'),
      payload: body.endCell(),
    })
  }
}
