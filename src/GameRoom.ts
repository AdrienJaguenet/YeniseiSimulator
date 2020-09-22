import { Room, Client } from "colyseus";
import { RoomState } from "./RoomState";
import { Building, EBuildingType } from './WorldState'

export class GameRoom extends Room<RoomState> {

  maxClients = 3

  onCreate (options: any) {
    this.setState(new RoomState());
    this.setMetadata({ name: "Default game room" });
    this.onMessage("type", (client, message) => {
      // handle "type" message
    });
  }

  onJoin (client: Client, options: any) {
    console.log('client ' + client.id + ' joined room ' + this.roomId)
    // this.state.world.buildings.push(new Building(EBuildingType.HOUSE, 1, 1));
    // this.lock();
  }

  onLeave (client: Client, consented: boolean) {
    console.log('client ' + client.id + ' left room ' + this.roomId)
  }

  onDispose() {
  }

}
