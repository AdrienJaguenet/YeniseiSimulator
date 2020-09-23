import { Room, Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import { RoomState } from "./schemas/RoomState";
import { Building, EBuildingType } from './schemas/WorldState'
import * as commands from './commands/RoomCommands'

export class GameRoom extends Room<RoomState> {
  dispatcher = new Dispatcher(this);
  maxClients = 3

  onCreate (options: any) {
    this.setState(new RoomState());
    this.dispatcher.dispatch(new commands.generateWorld());
  }

  onJoin (client: Client, options: any) {
    console.log('client ' + client.id + ' joined room ' + this.roomId)
    this.dispatcher.dispatch(new commands.createNewPlayer(), {sessionId: client.sessionId, nickname: options.nickname})
  }

  onLeave (client: Client, consented: boolean) {
    console.log('client ' + client.id + ' left room ' + this.roomId)
    this.dispatcher.dispatch(new commands.deleteDisconnectedPlayer(), {sessionId: client.sessionId})
  }

  onDispose() {
  }

}
