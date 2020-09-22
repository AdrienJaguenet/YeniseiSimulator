import { Room, Client } from "colyseus";
import consola from 'consola';
import { WorldState } from './WorldState';

export class GameRoom extends Room<WorldState> {

  maxClients = 1

  onCreate (options: any) {
    consola.log('room ' + this.roomId + ' created')

    this.onMessage("type", (client, message) => {
      // handle "type" message
    });

	this.setState(new WorldState);

  }

  onJoin (client: Client, options: any) {
    consola.log('client ' + client.id + ' joined room ' + this.roomId)
    // this.lock();
  }

  onLeave (client: Client, consented: boolean) {
    consola.log('client ' + client.id + ' left room ' + this.roomId)
  }

  onDispose() {
  }

}
