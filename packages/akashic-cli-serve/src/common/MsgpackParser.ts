import Emitter = require("component-emitter");
import { encode, decode } from "@msgpack/msgpack";
import { Packet, PacketType } from "socket.io-parser";

class Encoder {
	encode(packet: Packet): any[] {
		const encoded = encode(packet);
		const buffer = new Uint8Array(encoded);
		return [buffer];
	}
}

class Decoder extends Emitter {
	add(chunk: any): void {
		const packet = decode(chunk) as Packet;
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
