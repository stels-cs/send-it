import { Address, beginCell, toNano } from "@ton/core";
import { z } from "zod/v4";
import { TemplateType } from "@/templates/type";
import { t } from "@/getLang";
import { createDefaultTonTransaction } from "@/ton/createDefaultTonTransaction";

const Parser = z.object({
  collectionAddress: z.string().meta({
    title: t({
      en: 'Collection address',
      ru: 'Адрес контракта NFT коллекции',
    }),
  }),
  secondaryOwnerAddress: z.string().meta({
    title: t({
      en: 'Secondary owner address',
      ru: 'Адрес контракта кошелька',
    }),
  }),
})

export const SetSecondaryOwner: TemplateType = {
  id: 'SetSecondaryOwner',
  name: t({
    en: 'Change the address of the second owner',
    ru: 'Изменить адрес второго владельца'
  }),
  description: t({
    en: 'This address is present in some collections and is used for collection trust management. It is updated via op code 6.',
    ru: 'Этот адрес есть в некоторых коллекциях и используется для доверительного управления коллекцией. Обновляется через op код 6.'
  }),
  schema: z.toJSONSchema(Parser, { target: "draft-7" }),
  toTx: async (input: object) => {
    const data = Parser.parse(input);
    const body = beginCell()
      .storeUint(6, 32)
      .storeUint(Date.now(), 64)
      .storeAddress(Address.parse(data.secondaryOwnerAddress))
      .endCell()

    return createDefaultTonTransaction({
      to: Address.parse(data.collectionAddress),
      amount: toNano(0.05),
      payload: body
    });
  }
}
