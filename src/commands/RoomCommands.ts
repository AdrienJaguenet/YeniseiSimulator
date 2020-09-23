import { Command } from "@colyseus/command";
import { Room } from "colyseus";
import { RoomState, Player } from '../schemas/RoomState'
import { Tile, ETerrainType } from '../schemas/WorldState'

export class createNewPlayer extends Command<RoomState, { sessionId: string, nickname: string }> {
  execute({ sessionId, nickname }) {
    this.state.players[sessionId] = new Player(nickname);
  }
}

export class deleteDisconnectedPlayer extends Command<RoomState, {sessionId: string}> {
    execute({sessionId}) {
        delete this.state.players[sessionId];
    }
}

export class generateWorld extends Command<RoomState, {}> {
    execute() {
        for (var i = 0; i < this.state.world.size; ++i) {
			for (var j = 0; j < this.state.world.size; ++j) {
				this.state.world.tiles.push(new Tile(ETerrainType.GRASS, i, j));
			}
		}
    }
}