import { Address, beginCell, toNano } from "@ton/core";
import { z } from "zod/v4";
import { SendTransactionRequest } from "@tonconnect/sdk";
import { TemplateType } from "@/templates/type";

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

    const tx: SendTransactionRequest = {
      validUntil: Date.now() + 1000 * 60 * 5,
      messages: [
        {
          address: Address.parse(data.collectionAddress).toString(),
          amount: toNano('0.05').toString(),
          payload: body.toBoc().toString('base64'),
        }
      ]
    }
    return tx;
  }
}
