import { Address, beginCell, Cell, StateInit, storeStateInit } from "@ton/core";
import { SendTransactionRequest } from "@tonconnect/sdk";

export function createDefaultTonTransaction(input: {
  to: Address,
  amount: bigint,
  payload?: Cell
  stateInit?: StateInit
}, ui?: {text:string, link?:string}) {
  const tx: SendTransactionRequest = {
    validUntil: Date.now() + 1000 * 60 * 5,
    messages: [
      {
        address: input.to.toString(),
        amount: input.amount.toString(),
        payload: input.payload?.toBoc().toString('base64'),
        stateInit: input.stateInit
          ? beginCell().store(storeStateInit(input.stateInit)).endCell().toBoc().toString('base64')
          : undefined
      }
    ]
  }
  return {tx, ui}
}
