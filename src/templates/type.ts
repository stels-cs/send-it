import { SendTransactionRequest } from "@tonconnect/sdk";

export type TemplateType = {
  id: string,
  name: string
  description: string
  schema: unknown,
  toTx: (input: object) => Promise<SendTransactionRequest>
}
