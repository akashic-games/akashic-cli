import type { MessageEventIndex, EventCode, EventIndex, MessageEvent, Event } from "@akashic/playlog";
import type { NicoliveComment } from "./types/NicoliveCommentPlugin";

// serve (のクライアント側) は isolatedModules: true のため、
// const enum で定義されている EventCode は「値として」は参照できない (コンパイルエラーになる)。
// 仕方がないので必要な値だけここで定義しなおす。
// 型情報としては const enum を参照することで、値の不整合が起きないようになっていることに注意。
//
// TODO playlog 自身でこの定義を (ルート以外のパスから) 提供する？
export const EventCodeMessage: EventCode.Message = 32;
export const EventIndexCode: EventIndex.Code = 0;
export const MessageEventIndexData: MessageEventIndex.Data = 3;

export interface NicoliveCommentMessageEvent extends MessageEvent {
	[MessageEventIndexData]: {
		type: "nicoservice:stream:comment";
		comments: NicoliveComment[];
	};
}

export function isNicoliveCommentMessageEvent(ev: Event): ev is NicoliveCommentMessageEvent {
	return ev[EventIndexCode] === EventCodeMessage && ev[MessageEventIndexData]?.type === "nicoservice:stream:comment";
}

export function createNicoliveCommentMessageEvent(comments: NicoliveComment[]): NicoliveCommentMessageEvent {
	return [
		EventCodeMessage,
		0,
		":akashic",
		{
			type: "nicoservice:stream:comment",
			comments
		}
	];
}
