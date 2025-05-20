import { NftCollectionTransfer } from "@/templates/NftCollectionTransfer";
import { TemplateType } from "./type";
import { TonDNSBalanceRelease } from "@/templates/TonDNSBalanceRelease";

export const templatesList = [
  NftCollectionTransfer,
  TonDNSBalanceRelease,
]

export function getTemplateById(id:string): { type: "ok"; template: TemplateType } | { type: "error"; reason: string } {
  const t = templatesList.find(x => x.id === id)
  if (t) {
    return {type:'ok', template:t}
  }
  return {type:'error', reason: `Template with id = ${id} not found`}
}
