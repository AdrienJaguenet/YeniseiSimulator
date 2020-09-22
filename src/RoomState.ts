import { Schema, ArraySchema, type } from '@colyseus/schema';
import { WorldState } from './WorldState'

export class RoomState extends Schema {
    @type('string')
    host: string = "test"

    // @type(WorldState)
    // world: WorldState = new WorldState()

    constructor () {
		super();
	}	
}