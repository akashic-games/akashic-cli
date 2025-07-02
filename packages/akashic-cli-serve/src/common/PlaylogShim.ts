import type { MessageEventIndex, EventCode, EventIndex, MessageEvent, Event } from "@akashic/playlog";
import type { NamagameCommentEventComment } from "./types/NamagameCommentPlugin.js";

// serve (のクライアント側) は isolatedModules: true のため、
// const enum で定義されている EventCode は「値として」は参照できない (コンパイルエラーになる)。
// 仕方がないので必要な値だけここで定義しなおす。
// 型情報としては const enum を参照することで、値の不整合が起きないようになっていることに注意。
//
// TODO playlog 自身でこの定義を (ルート以外のパスから) 提供する？
export const EventCodeMessage: EventCode.Message = 32;
export const EventIndexCode: EventIndex.Code = 0;
export const MessageEventIndexData: MessageEventIndex.Data = 3;

export interface NamagameCommentEvent extends MessageEvent {
	[MessageEventIndexData]: {
		type: "namagame:comment";
		comments: NamagameCommentEventComment[];
	};
}

export function isNamagameCommentEvent(ev: Event): ev is NamagameCommentEvent {
	return ev[EventIndexCode] === EventCodeMessage && ev[MessageEventIndexData]?.type === "namagame:comment";
}

export function createNamagameCommentEvent(comments: NamagameCommentEventComment[]): NamagameCommentEvent {
	return [
		EventCodeMessage,
		0,
		":akashic",
		{
			type: "namagame:comment",
			comments
		}
	];
}
