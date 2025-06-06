import { Address, beginCell, Cell, toNano } from "@ton/core";
import { z } from "zod/v4";
import { TemplateType } from "@/templates/type";
import { t } from "@/getLang";
import { getQueryId } from "@/ton/getQueryId";
import { createDefaultTonTransaction } from "@/ton/createDefaultTonTransaction";

const Parser = z.object({
  collectionAddress: z.string().meta({
    title: t({
      en: 'Collection address',
      ru: 'Адрес коллекции'
    }),
  }),
  nftIndex: z.int().meta({
    title: t({
      ru:'Номер NFT (Index/Token ID)',
      en:'NFT Index/Token ID'
    }),
    description: t({
      ru: 'Номер NFT можно найти на странице getgems.io (Token ID) или на ton.cx (Index), обратите внимание что он может отличатся от числа в названии NFT',
      en: 'You can find the NFT number on getgems.io (Token ID) or ton.cx (Index)',
    })
  }),
  amount: z.float32().meta({
    title: t({ru:'Количество TON',en:'TON Amount'}),
    description: t({
      ru: 'Рекомендуется указать значение на 0.02 TON меньше, чем баланс коллекции',
      en: 'It’s recommended to enter a value 0.02 TON less than the collection balance'
    })
  })
})

export const NftCollectionClaimBalance: TemplateType = {
  id: 'NftCollectionClaimBalance',
  name: t({
    en:'Withdraw TON from NFT collection balance',
    ru:'Забрать тоны с баланса NFT коллекции'
  }),
  description: t({
    en: "Используйте эту форму, чтобы забрать с баланса NFT-коллекции излишки TON. Эта форма отправляет запрос на минтинг NFT в коллекции. В этом запросе есть поле (Количество TON) — это количество будет перемещено с баланса коллекции на баланс NFT. Далее передайте NFT самому себе, после этого лишние тоны вернутся на ваш кошелёк. Для SBT используйте форму для отправки op-кода op::take_excess",
    ru: 'Use this form to withdraw excess TON from the NFT collection balance. It sends a mint request to the collection. The request has a “TON amount” field — that amount will move from the collection balance to the NFT balance. Then transfer the NFT to yourself — the excess TON will return to your wallet. For SBT, use the form to send op::take_excess opcode.'
  }),
  schema: z.toJSONSchema(Parser, { target: "draft-7" }),
  toTx: async (input: object) => {
    const data = Parser.parse(input);
    const body = beginCell()
      .storeUint(1, 32)
      .storeUint(getQueryId(), 64)
      .storeUint(BigInt(data.nftIndex), 64)
      .storeCoins(toNano(data.amount))
      .storeRef(new Cell())

    return createDefaultTonTransaction({
      to: Address.parse(data.collectionAddress),
      amount: toNano('0.05'),
      payload: body.endCell()
    });
  }
}
