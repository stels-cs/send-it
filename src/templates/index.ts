import { NftCollectionTransfer } from "@/templates/NftCollectionTransfer";
import { TemplateType } from "./type";
import { TonDNSBalanceRelease } from "@/templates/TonDNSBalanceRelease";
import { TonDNSSetWallet } from "@/templates/TonDNSSetWallet";
import { NftCollectionClaimBalance } from "@/templates/NftCollectionClaimBalance";
import { SendOpCode } from "@/templates/SendOpCode";
import { RoyaltyDistributor } from "@/templates/RoyaltyDistributor";
import { SetSecondaryOwner } from "@/templates/SetSecondaryOwner";

export const templatesList = [
  NftCollectionTransfer,
  TonDNSBalanceRelease,
  TonDNSSetWallet,
  NftCollectionClaimBalance,
  SendOpCode,
  RoyaltyDistributor,
  SetSecondaryOwner,
]

export function getTemplateById(id:string): { type: "ok"; template: TemplateType } | { type: "error"; reason: string } {
  const t = templatesList.find(x => x.id === id)
  if (t) {
    return {type:'ok', template:t}
  }
  return {type:'error', reason: `Template with id = ${id} not found`}
}
