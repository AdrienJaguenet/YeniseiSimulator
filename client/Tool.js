var current_tool = 'info'

function buildTool(name) {
	return {
		hoverTile : name,
		use : function(i, j) {
			var tile = terrain.GetTile(i, j);
			tile.building = new Building(name, i, j);
			terrain.buildings.push(tile.building);
			sfx.build.play();

		},
		canUse : function(i, j) {
			var tile = terrain.GetTile(i, j);
			return (tile.type == 'grass' || tile.type == 'trees') // check terrain type
			   && (resources.workers - resources.used_workers > 0) // enough workers
			   && terrain.IsAdjacentTo(i, j, (t) => { return t.type == 'road' }) // must be next to a road
			   && tile.building === undefined // cannot build over an existing building
		}
	}
}

function drawTool(i, j, tool) {
	var color = []
	if (tool.canUse(i, j)) {
		color = [.25, .75, .25];
	} else {
		color = [.75, .25, .25];
	}
	new Tile(tool.hoverTile).Draw(i, j, {color : color})
}

var tools = {
	'road' : buildTool('road'),
	'chimney' : buildTool('chimney'),
	'house' : buildTool('house'),
	'info' : {
		hoverTile : 'tile_select',
		use : function(i, j)  {
		if (terrain.GetTile(i, j).building) {
				building_selected = terrain.GetTile(i, j).building
			} else {
				building_selected = null
			}
		},
		canUse : function() {
			return true;
		}
	},
	'destroy' : {
		hoverTile : 'tile_select',
		use : function(i, j) {
			var tile = terrain.GetTile(i, j);
			if (tile.building) {
				tile.building.Destroy();
				tile.building = null;
			} else if (tile.type != 'grass') {
				tile.type = 'grass'
			}
		},
		canUse : function(i, j) {
			return true
		}
	},
}

tools['road'].use = function(i, j) {
	var tile = terrain.GetTile(i, j)
	tile.type = 'road'
	sfx.build.play()
}

tools['road'].canUse = function(i, j) {
	var tile = terrain.GetTile(i, j);
	return (tile.type == 'grass' || tile.type == 'trees'); // check terrain type
}

