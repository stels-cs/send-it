import { Address, beginCell, toNano } from "@ton/core";
import { z } from "zod/v4";
import { SendTransactionRequest } from "@tonconnect/sdk";
import { TemplateType } from "@/templates/type";

const Parser = z.object({
  nftAddress: z.string().meta({
    title: 'Nft address',
  }),
  bidAmountTon: z.string().meta({
    title: 'Bid amount TON',
    description: 'For 4x domain - 100 ton, for 5x domain - 50, 6x - 40, 7x - 30, 8x - 20, 9x - 10, 10x - 5, 1 ton'
  }),
})

export const TonDNSBalanceRelease: TemplateType = {
  id: 'TonDNSBalanceRelease',
  name: "Grab TON DNS after year",
  description: "Send op::dns_balance_release (0x4ed14b65) to TON DNS for restart auction",
  schema: z.toJSONSchema(Parser, {target:"draft-7"}),
  toTx: async (input: object) => {
    const data = Parser.parse(input);
    const body = beginCell().storeUint(0x4ed14b65, 32)
      .storeUint(5585, 64) // queryId
    .endCell();

    const tx: SendTransactionRequest = {
      validUntil: Date.now() + 1000 * 60 * 5,
      messages: [
        {
          address: Address.parse(data.nftAddress).toString(),
          amount: toNano(data.bidAmountTon).toString(),
          payload: body.toBoc().toString('base64'),
        }
      ]
    }
    return tx;
  }
}
