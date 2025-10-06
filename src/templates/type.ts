import { SendTransactionRequest } from "@tonconnect/sdk";
import { Address } from "@ton/core";

export type TemplateType = {
  id: string,
  name: string
  description: string
  schema: unknown,
  toTx: (input: object, ctx: {
    tonAddressFormat: (address: Address, bounce: boolean) => string,
    addressInExplorer: (address: Address, bounce: boolean) => string,
  }) => Promise<{tx:SendTransactionRequest, ui?:{text:string, link?:string}}>
}
