import { Address, Cell } from "@ton/core";
import { SendTransactionRequest } from "@tonconnect/sdk";

export function createDefaultTonTransaction(input: {
  to: Address,
  amount: bigint,
  payload?: Cell
}) {
  const tx: SendTransactionRequest = {
    validUntil: Date.now() + 1000 * 60 * 5,
    messages: [
      {
        address: input.to.toString(),
        amount: input.amount.toString(),
        payload: input.payload?.toBoc().toString('base64'),
      }
    ]
  }
  return tx
}
