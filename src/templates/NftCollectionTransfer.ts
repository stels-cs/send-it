import { Address, beginCell, toNano } from "@ton/core";
import { z } from "zod/v4";
import { TemplateType } from "@/templates/type";
import { createDefaultTonTransaction } from "@/ton/createDefaultTonTransaction";

const Parser = z.object({
  collectionAddress: z.string().meta({
    title: 'Collection address',
  }),
  newOwnerAddress: z.string().meta({
    title: 'New owner address'
  }),
})

export const NftCollectionTransfer: TemplateType = {
  id: 'NftCollectionTransfer',
  name: "Transfer NFT collection",
  description: "Change ownership of nft collection",
  schema: z.toJSONSchema(Parser, {target:"draft-7"}),
  toTx: async (input: object) => {
    const data = Parser.parse(input);
    const body = beginCell().storeUint(3, 32)
      .storeUint(0, 64) // queryId
    .storeAddress(Address.parse(data.newOwnerAddress))
    .endCell();

    return createDefaultTonTransaction({
      to: Address.parse(data.collectionAddress),
      amount: toNano('0.05'),
      payload: body,
    })
  }
}
