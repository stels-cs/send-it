import { crc32str } from "@/crc32str";
import { Address, beginCell, Cell, Slice } from "@ton/core";


export const NftOpTransfer = 0x5fcc3d14;
export const NftOpGetStaticData = 0x2fcb26a2;
export const NftOpGetStaticDataResponse = 0x8b771735;
export const NftOpGetRoyaltyParams = 0x693d3950;
export const NftOpGetRoyaltyParamsResponse = 0xa8cb00ad;
export const NftOpEditContent = 0x1a0b9d51;
export const NftOpTransferEditorship = 0x1c04412a;
export const NftOpOwnershipAssigned = 0x05138d91;
export const NftOpClaimJetton = crc32str('op::claim_jetton');

export const NftOperationCodes = {
  transfer: NftOpTransfer,
  getStaticData: NftOpGetStaticData,
  getStaticDataResponse: NftOpGetStaticDataResponse,
  GetRoyaltyParams: NftOpGetRoyaltyParams,
  GetRoyaltyParamsResponse: NftOpGetRoyaltyParamsResponse,
  EditContent: NftOpEditContent,
  TransferEditorship: NftOpTransferEditorship,
  OwnershipAssigned: NftOpOwnershipAssigned,
  ClaimJetton: NftOpClaimJetton,
};

export const NftItemMessages = {
  transfer: (params: { skipHeader?: boolean; queryId?: bigint; newOwner: Address; responseTo?: Address; forwardAmount?: bigint; forwardPayload?: Slice }) => {
    const msgBody = beginCell();
    if (!params.skipHeader) {
      msgBody.storeUint(NftOperationCodes.transfer, 32);
      msgBody.storeUint(params.queryId || 0, 64);
    }
    msgBody.storeAddress((params.newOwner));
    msgBody.storeAddress((params.responseTo || null));
    msgBody.storeBit(false); // no custom payload
    msgBody.storeCoins((params.forwardAmount || 0n));
    if (params.forwardPayload) {
      msgBody.storeSlice(params.forwardPayload);
    } else {
      msgBody.storeBit(0); // no forward_payload yet
    }

    return msgBody.endCell();
  },
  getStaticData: (params: { queryId?: number }) => {
    const msgBody = beginCell();
    msgBody.storeUint(NftOperationCodes.getStaticData, 32);
    msgBody.storeUint(params.queryId || 0, 64);
    return msgBody.endCell();
  },
  getRoyaltyParams: (params: { queryId?: number }) => {
    const msgBody = beginCell();
    msgBody.storeUint(NftOperationCodes.GetRoyaltyParams, 32);
    msgBody.storeUint(params.queryId || 0, 64);
    return msgBody.endCell();
  },
  // editContent: (params: { type: 'single-nft'; queryId?: bigint; content: string; royaltyParams: RoyaltyParams } | { type: 'editable-nft'; queryId?: bigint; content: string }) => {
  //   const msgBody = beginCell();
  //   msgBody.storeUint(NftOperationCodes.EditContent, 32);
  //   msgBody.storeUint(params.queryId || 0, 64);
  //
  //   const contentCell = params.type === 'single-nft'
  //     ? encodeTokenContent(params.content)
  //     : (beginCell().storeBuffer(Buffer.from(params.content))).endCell();
  //
  //   msgBody.storeRef((contentCell));
  //   if (params.type === 'single-nft') {
  //     const royaltyCell = beginCell();
  //     royaltyCell.storeUint(params.royaltyParams.royaltyFactor, 16);
  //     royaltyCell.storeUint(params.royaltyParams.royaltyBase, 16);
  //     royaltyCell.storeAddress(params.royaltyParams.royaltyAddress);
  //     msgBody.storeRef(royaltyCell);
  //   }
  //
  //   return msgBody.endCell();
  // },
  transferEditorship: (params: { queryId?: number; newEditor: Address; responseTo: Address | null; forwardAmount?: bigint }) => {
    const msgBody = beginCell();
    msgBody.storeUint(NftOperationCodes.TransferEditorship, 32);
    msgBody.storeUint(params.queryId || 0, 64);
    msgBody.storeAddress(params.newEditor);
    msgBody.storeAddress(params.responseTo || null);
    msgBody.storeBit(false); // no custom payload
    msgBody.storeCoins(params.forwardAmount || 0);
    msgBody.storeBit(0); // no forward_payload yet

    return msgBody.endCell();
  },
  mintEditableNftPayload: (params: { ownerAddress: Address; content: Cell; editorAddress: Address; forwardAmount?: bigint }) => {
    const b = beginCell()
      .storeAddress(params.ownerAddress)
      .storeRef(params.content)
      .storeAddress(params.editorAddress);
    if (params.forwardAmount) {
      b.storeCoins(params.forwardAmount);
    }
    return b.endCell();
  },
  mintSimpleNftPayload: (params: { ownerAddress: Address; content: Cell; forwardAmount?: bigint }) => {
    const b = beginCell()
      .storeAddress(params.ownerAddress)
      .storeRef(params.content);
    if (params.forwardAmount) {
      b.storeCoins(params.forwardAmount);
    }
    return b.endCell();
  },
  claimJetton: (queryId: bigint) => {
    return beginCell()
      .storeUint(NftOperationCodes.ClaimJetton, 32)
      .storeUint(queryId, 64)
      .endCell();
  },
  createNftCommentCell: (params: { author: Address; comment: string; address: Address; amount: bigint }) => {
    const maxCommentBytes = 512;
    const raw = Buffer.from(params.comment, 'utf8');
    const limited = raw.length > maxCommentBytes ? raw.subarray(0, maxCommentBytes) : raw;

    return beginCell()
      .storeAddress(params.address)
      .storeAddress(params.author)
      .storeCoins(params.amount)
      .storeBuffer(limited)
      .endCell();
  },
};
