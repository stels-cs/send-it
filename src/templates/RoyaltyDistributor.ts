import { Address } from "@ton/core";
import { z } from "zod/v4";
import { TemplateType } from "@/templates/type";
import { createNewDistributionContract } from "@/ton/royalty-distributor";
import { t } from "@/getLang";
import { createDefaultTonTransaction } from "@/ton/createDefaultTonTransaction";

const Parser = z.object({
  list: z.array(z.object({
    address: z.string().meta({
      title: t({
        ru: 'Адрес кошелька',
        en: 'Wallet address'
      })
    }),
    percent: z.number().meta({
      title: t({
        ru: 'Процент: 1–99',
        en: 'Percentage: 1–99'
      })
    })
  })).meta({
    title: t({
      ru: 'Список адресов',
      en: 'List of addresses'
    }),
    description: t({
      ru: 'Не более 10 кошельков. Сумма процентов должна быть равна 100',
      en: 'No more than 10 wallets. The total percentage must equal 100'
    }),
    minItems: 2
  }),
  trustedBackupAddress: z.string().meta({
    title: t({
      ru: 'Запасной адрес кошелька',
      en: 'Backup wallet address',
    }),
    description: t({
      ru: 'Этот адрес будет использован в случае проблем с распределением. Чтобы протестировать контракт, отправьте на него 1 TON и убедитесь, что распределение прошло правильно',
      en: 'his address will be used in case of issues with distribution. To test the contract, send 1 TON to it and make sure the distribution works correctly'
    })
  }),
})

export const RoyaltyDistributor: TemplateType = {
  id: 'RoyaltyDistributor',
  name: t({
    ru: 'Распределение роялти',
    en: 'Royalty distribution'
  }),
  description: t({
    ru: 'Этот шаблон создаёт контракт для распределения TON в разных пропорциях. Код контракта доступен здесь: github.com/ton-community/royalty-distributor. Допускается не более 10 адресов. Если на контракт поступает небольшое количество TON, он будет накапливать их, пока не соберётся 1 TON. Этот контракт НЕ может распределять токены (USDT, WOOF, SCALE и другие)',
    en: 'This template creates a contract for distributing TON in different proportions. The contract code is available at: github.com/ton-community/royalty-distributor. No more than 10 addresses are allowed. If the contract receives a small amount of TON, it will accumulate them until it reaches 1 TON. This contract CANNOT distribute tokens (USDT, WOOF, SCALE, and others)',
  }),
  schema: z.toJSONSchema(Parser, {target:"draft-7"}),
  toTx: async (input: object, ctx) => {
    const data = Parser.parse(input);
    const contract = createNewDistributionContract(data.list.map(i => ({
      address: Address.parse(i.address),
      royaltyPercent: BigInt(i.percent*1000)
    })), Address.parse(data.trustedBackupAddress))

    const uiResult = {
      text: t({
        en: `The distribution contract has been created, its address is`,
        ru:`Контракт распределения создан, его адрес`
      }),
      link: ctx.addressInExplorer(contract.address, false),
    }

    return createDefaultTonTransaction({
      to: contract.address,
      amount: contract.amount,
      payload: contract.message,
      stateInit: contract.stateInit
    }, uiResult)
  }
}
