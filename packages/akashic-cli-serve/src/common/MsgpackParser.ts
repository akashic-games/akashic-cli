import { encode, decode } from "@msgpack/msgpack";
import { Emitter } from "@socket.io/component-emitter";
import type { Packet } from "socket.io-parser";
import { PacketType } from "socket.io-parser";
import type { MessageEncodeTestbedEvent } from "./types/TestbedEvent.js";

type EncoderEvents = { encoded: (d: MessageEncodeTestbedEvent) => void };
type DecoderEvents = { decoded: (p: Packet) => void };

class Encoder extends Emitter<EncoderEvents, EncoderEvents> {
	encode(packet: Packet): any[] {
		const encoded = encode(packet);
		this.emit("encoded", { packet, encoded } as MessageEncodeTestbedEvent);
		return [encoded];
	}
}

class Decoder extends Emitter<DecoderEvents, DecoderEvents> {
	add(chunk: any): void {
		const packet = decode(chunk) as Packet;
		// 指定の namespace への初回接続時 (PacketType === CONNECT) に `packet.data` の値が `authPayload` として利用されるが、
		// その際に `authPayload === null` だと msgpack のエンコード時にエラーとなるため暫定対応で `undefined` で上書きする。
		// @see https://github.com/socketio/socket.io-protocol#exchange-protocol
		// @see https://github.com/socketio/socket.io/blob/15af22f/lib/client.ts#L277
		//
		// FIXME: 以下の PullRequest のマージにより本暫定対応を削除できる可能性がある
		// https://github.com/socketio/socket.io/pull/4675
		if (packet.data === null) {
			packet.data = undefined;
		}
		if (this.isPacketValid(packet)) {
			this.emit("decoded", packet);
		} else {
			throw new Error("invalid format");
		}
	}

	isPacketValid({ type, data, nsp, id }: Packet): boolean {
		const isNamespaceValid = typeof nsp === "string";
		const isAckIdValid = id === undefined || Number.isInteger(id);
		if (!isNamespaceValid || !isAckIdValid) {
			return false;
		}
		switch (type) {
			case PacketType.CONNECT:
				return data === undefined || typeof data === "object";
			case PacketType.DISCONNECT:
				return data === undefined;
			case PacketType.EVENT:
				return Array.isArray(data) && data.length > 0;
			case PacketType.ACK:
				return Array.isArray(data);
			case PacketType.CONNECT_ERROR:
				return typeof data === "object";
			default:
				return false;
		}
	}

	destroy(): void {
		// do nothing
	}
}

export default {
	Encoder, Decoder
};
