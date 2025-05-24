import { Address, beginCell, toNano } from "@ton/core";
import { z } from "zod/v4";
import { TemplateType } from "@/templates/type";
import { t } from "@/getLang";
import { createDefaultTonTransaction } from "@/ton/createDefaultTonTransaction";

const Parser = z.object({
  address: z.string().meta({
    title: t({
      en: 'Contract address',
    }),
  }),
  opCode: z.string().meta({
    title: t({
      en:'Op code'
    }),
    description: t({
      en: 'Like 0xd136d3b3',
    })
  }),
  queryId: z.string().meta({
    title: t({en:'Query ID'}),
    description: t({
      en: 'Only digits 0-9, example 0'
    })
  }),
  amount: z.float32().meta({
    title: t({ru:'Количество TON',en:'TON Amount'}),
    description: t({
      en: 'Example 0.05 TON'
    })
  })
})

export const SendOpCode: TemplateType = {
  id: 'SendOpCode',
  name: t({
    en:'Send op code',
  }),
  description: t({
    en: 'Send op code to contract'
  }),
  schema: z.toJSONSchema(Parser, { target: "draft-7" }),
  toTx: async (input: object) => {
    const data = Parser.parse(input);
    const body = beginCell()
      .storeUint(Number(data.opCode), 32)
      .storeUint(BigInt(data.queryId), 64)
      .endCell()

    return createDefaultTonTransaction({
      to: Address.parse(data.address),
      amount: toNano(data.amount),
      payload: body
    });
  }
}
