var tiles = {}

function isoTile(tilemap, x, y) {
	return {
		extra_height : 38,
		tilemap : tilemap,
		quad : {
			sx : (x-1) * 32,
			sy : (y-1) * 64,
			sw : 32,
			sh : 64
		}
	}
}

function loadTiles() {
	terrain_tilemap.src = 'resources/gfx/terrain.png';
	return {
		tile_select : {
			layers : [
				isoTile(terrain_tilemap, 1, 1)
			],
		},
		concrete : {
			layers : [
				isoTile(terrain_tilemap, 1, 2)
			]
		},
		river : {
			layers : [
				{
					oriented : {
						''     : isoTile(terrain_tilemap,  7, 4),
						'N'    : isoTile(terrain_tilemap,  2, 4),
						'W'    : isoTile(terrain_tilemap, 10, 4),
						'WE'   : isoTile(terrain_tilemap,  4, 4),
						'S'    : isoTile(terrain_tilemap,  1, 4),
						'SE'   : isoTile(terrain_tilemap,  3, 4),
						'SW'   : isoTile(terrain_tilemap, 11, 4),
						'SWE'  : isoTile(terrain_tilemap,  5, 4),
						'N'    : isoTile(terrain_tilemap, 14, 4),
						'NE'   : isoTile(terrain_tilemap,  8, 4),
						'NW'   : isoTile(terrain_tilemap, 12, 4),
						'NWE'  : isoTile(terrain_tilemap,  6, 4),
						'NS'   : isoTile(terrain_tilemap, 15, 4),
						'NSE'  : isoTile(terrain_tilemap,  9, 4),
						'NSW'  : isoTile(terrain_tilemap, 13, 4),
						'NSWE' : isoTile(terrain_tilemap,  7, 4)
					}
				}
			]
		},
		grass : {
			layers : [
				isoTile(terrain_tilemap, 1, 2)
			],
		},
		road : {
			layers : [
				isoTile(terrain_tilemap, 1, 2),
				{
					oriented : {
						''     : isoTile(terrain_tilemap,  7, 5),
						'N'    : isoTile(terrain_tilemap, 14, 5),
						'S'    : isoTile(terrain_tilemap,  1, 5),
						'W'    : isoTile(terrain_tilemap, 10, 5),
						'E'    : isoTile(terrain_tilemap,  2, 5),
						'NE'   : isoTile(terrain_tilemap,  8, 5),
						'NW'   : isoTile(terrain_tilemap, 12, 5),
						'NS'   : isoTile(terrain_tilemap, 15, 5),
						'SE'   : isoTile(terrain_tilemap,  3, 5),
						'SW'   : isoTile(terrain_tilemap, 11, 5),
						'WE'   : isoTile(terrain_tilemap,  4, 5),
						'NWE'  : isoTile(terrain_tilemap,  6, 5),
						'NSE'  : isoTile(terrain_tilemap,  9, 5),
						'NSW'  : isoTile(terrain_tilemap, 13, 5),
						'SWE'  : isoTile(terrain_tilemap,  5, 5),
						'NSWE' : isoTile(terrain_tilemap,  7, 5),
					}
				},
			],
		},
		trees : {
			layers : [
				{
					variations : [
						isoTile(terrain_tilemap, 2, 2),
						isoTile(terrain_tilemap, 3, 2),
						isoTile(terrain_tilemap, 4, 2),
						isoTile(terrain_tilemap, 5, 2),
					]
				},
			],
		},
		chimney : {
			layers : [
				isoTile(terrain_tilemap, 3, 3),
			],
		},
		house : {
			layers : [
				isoTile(terrain_tilemap, 2, 3),
			],
		},
	}
}

class Tile
{
	constructor(t) {
		this.type = t;
		this.variation = Math.floor(Math.random() * 100);
		this.building = undefined;
	}

	GetSprite(i, j, layer) {
		if (! this.type in gfx.tiles) {
			console.error('Tile at '+i+', '+j+'has unknown type "'+this.type+'"')
		}

		var obj = gfx.tiles[this.type].layers[layer]

		if (obj && obj.oriented) {
			var c = map.GetMooreNeighbourhood(i, j);
			var north = c[0], south = c[1], west = c[2], east = c[3];
			var str = '';

			if (north !== undefined && north.type == this.type) {
				str += 'N';
			}

			if (south !== undefined && south.type == this.type) {
				str += 'S';
			}

			if (west !== undefined && west.type == this.type) {
				str += 'W';
			}

			if (east !== undefined && east.type == this.type) {
				str += 'E';
			}
			
			return obj.oriented[str]

		} else if (obj !== undefined && 'variations' in obj) {
			return obj['variations'][Math.floor(this.variation % obj.variations.length)];
		} else {
			return obj;
		}
	}

	Draw(i, j, settings) {
		var layer = gfx.tiles[this.type].layers.length - 1;
		if ('layer' in settings) {
			layer = settings['layer'];
		}
		var sprite = this.GetSprite(i, j, layer)

		if (sprite === undefined) {
			return;
		}

		var draw_origin = utils.iso2screen(i, j)
		draw_origin.y = draw_origin.y - sprite.extra_height * camera.zoom

		ctx.drawImage(sprite.tilemap, sprite.quad.sx, sprite.quad.sy, sprite.quad.sw, sprite.quad.sh,
		             (draw_origin.x + camera.offset.x), (draw_origin.y + camera.offset.y),
					 sprite.quad.sw * camera.zoom, sprite.quad.sh * camera.zoom)
	}
}

