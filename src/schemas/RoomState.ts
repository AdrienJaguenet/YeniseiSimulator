import { Schema, ArraySchema, type, MapSchema } from '@colyseus/schema';
import { WorldState } from './WorldState'

export class Player extends Schema {
  @type('string') nickname: string;
  @type('number') cameraX: number = 0;
  @type('number') cameraY: number = 0;

  constructor(nickname: string) {
    super()
    this.nickname = nickname;
  }
}

export class RoomState extends Schema {
    @type('string')
    host: string = "test"

    @type(WorldState)
    world: WorldState = new WorldState()

    @type({ map: Player })
    players = new MapSchema<Player>();

    constructor () {
		super();
	}	
}
