var building_protos = {};

class Building
{
	FindAllTilesAround(radius, fn) {
		var tiles = {}
		for (var x=this.x-radius; x < this.x+radius; ++x) {
			for (var y=this.y-radius; y < this.y+radius; ++y) {
				var ftile = map.GetTile(x, y)
				if (ftile != null && fn(ftile)) {
					table.insert(tiles, ftile)
				}
			}
		}
		return tiles;
	}


	CountTilesAround(radius, fn) {
		return this.FindAllTilesAround(radius, fn).length;
	}

	SelectRandomTile(radius, fn) {
		var tiles = this.FindAllTilesAround(radius, fn)
		var t = tiles[math.floor(math.random() * tiles.length)]
		return t;
	}

	constructor(t, x, y) {
		if (building_protos[t] == null) {
			console.error('Tried to instantiate a building with type \"'+t+'\"')
		}
		this.proto = building_protos[t];
		this.x = x;
		this.y = y;
		this.internal_counter = 0;
		this.workers = 0;
	}

	GetSprite() {
		return this.proto.gfx;
	}

	Draw(layer) {
		var draw_origin = utils.iso2screen(this.x, this.y)
		if (layer == null) {
			layer = this.proto.gfx.layers.length;
		} else {
			layer -= 1;
		}
		var sprite = this.proto.gfx.layers[layer]
		if (sprite == null) { return }
		draw_origin.y = draw_origin.y - sprite.extra_height * camera.zoom
		ctx.drawImage(sprite.tilemap, sprite.quad.sx, sprite.quad.sy, sprite.quad.sw, sprite.quad.sh,
		             (draw_origin.x + camera.offset.x), (draw_origin.y + camera.offset.y),
					 sprite.quad.sw * camera.zoom, sprite.quad.sh * camera.zoom)
	}

	Update(dt) {
		this.internal_counter = this.internal_counter + dt
		return this.proto.OnUpdate(this, dt)
	}

	Destroy() {
		return this.proto.OnDestroy(this)
	}
}


function register_protobuilding(name, def) {
	var proto = {
		name : name,
		gfx : def.gfx,
		OnUpdate : def.OnUpdate == null ? function(building, dt) {} : def.OnUpdate,
		OnCreate : def.OnCreate == null ? function(building) {} : def.OnCreate,
		OnDestroy : def.OnDestroy == null ? function(building) {
			resources.used_workers = resources.used_workers - building.workers
		} : def.OnDestroy
	};
	building_protos[name] = proto;
}

function loadBuildings() {
	register_protobuilding('house', {
		gfx : gfx.tiles.house,
		OnCreate : function(building) {
			resources.workers += 1;
		},
		OnUpdate : function(house) {
			if (house.internal_counter > 0.1) {
				house.internal_counter -= 0.1;
			} else {
				return;
			}
			resources.food -= 1;
		},
		OnDestroy : function(building) {
			resources.workers -= 1;
		}
	});

	register_protobuilding('chimney', {
		gfx : gfx.tiles.chimney,
		OnCreate : function(chimney) {
			resources.used_workers += 1 
			chimney.workers = 1
		},
		OnUpdate : function(chimney, dt) {
			if (chimney.internal_counter > 0.1 ) {
				chimney.internal_counter -= 0.1;
			} else {
				return;
			}
			for (var i=0; i < chimney.workers; ++i) {
				var ftile = chimney.SelectRandomTile(2, (t) => {return t.type == 'trees'; })
				if (ftile != null && (ftile.type == 'trees')) {
					ftile.type = 'grass'
					resources.power += 2;
				}
			}
		}
	});

}

