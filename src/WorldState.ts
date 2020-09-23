import { Schema, ArraySchema, type } from '@colyseus/schema';

export enum ETerrainType {
	GRASS = 'grass',
	FOREST = 'forest',
	ROAD = 'road'
}

export enum EBuildingType {
	HOUSE = 'house',
	CHIMNEY = 'chimney'
}

class Tile extends Schema {
	@type('number') x: number;
	@type('number') y : number;
	@type('string') type: string;
	@type('number') variation: number;

	constructor (terrain: ETerrainType, x: number, y?: number) {
		super();
		this.x = x;
		this.y = y;
		this.type = terrain;
		this.variation = Math.floor(Math.random() * 100);
	}	
}

export class Building extends Schema {
	@type('number') x: number;
	@type('number') y: number;
	@type('string') type: string;

	constructor (type: EBuildingType, x: number, y?: number) {
		super();
		this.x = x;
		this.y = y;
		this.type = type
	}	
}

export class WorldState extends Schema {
	@type('number')
	size: number = 40
	@type([Tile])
	tiles = new ArraySchema<Tile>();

	@type([Building])
	buildings = new ArraySchema<Building>();

	constructor () {
		super();
		for (var i = 0; i < this.size; ++i) {
			for (var j = 0; j < this.size; ++j) {
				this.tiles.push(new Tile(ETerrainType.GRASS, i, j));
			}
		}
	}	
}



