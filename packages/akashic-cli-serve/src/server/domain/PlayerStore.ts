import { Player } from "../../common/types/Player";

export class PlayerStore {
	private players: Player[];
	private nextPlayerId: number;

	constructor() {
		this.players = [];
		this.nextPlayerId = 0;
	}

	getPlayer(playerId: string): Player {
		return this.players.find(player => player.id === playerId);
	}

	registerPlayer(player: Player): Player {
		const playerId: string = player.id || this.nextPlayerId.toString();
		const playerName: string = player.name || "player" + playerId;
		const registeredPlayer: Player = { id: playerId, name: playerName };
		this.players.push(registeredPlayer);
		this.nextPlayerId++;
		return registeredPlayer;
	}
}
