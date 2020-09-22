import { Schema, ArraySchema, type } from '@colyseus/schema';

enum TerrainType {
	GRASS = 'grass',
	FOREST = 'forest',
	ROAD = 'road'
}

enum BuildingType {
	HOUSE = 'house',
	CHIMNEY = 'chimney'
}

class Tile extends Schema {
	@type('number')
	x : number;
	@type('number')
	y : number;
	@type('string')
	terrain : TerrainType;
	
}

class Building extends Schema {
	@type('number')
	x : number;
	@type('number')
	y : number;
	@type('string')
	building : BuildingType;
}

export class WorldState extends Schema {
	@type([Tile])
	tiles = new ArraySchema<Tile>();

	@type([Building])
	buildings = new ArraySchema<Building>();
}



