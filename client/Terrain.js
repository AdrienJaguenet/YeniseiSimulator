class Terrain {
	constructor(size) {
		this.size = size,
		this.tiles = new Array(size),
		this.buildings = []
	}

	FromServer(host, port) {
		var response = {}
		var url = 'http://'+host+':'+port+'/map'
		console.log(url)
	}

	Generate() {
		//this.FromServer('localhost', 3000)
		for (var i = 0; i < this.size; ++i) {
			this.tiles[i] = new Array(this.size);
			for (var j = 0; j < this.size; ++j) {
				this.tiles[i][j] = new Tile('grass');
			}
		}
	}

	GetTile(x, y) {
		var row = this.tiles[x]
		if (row !== undefined) {
			return this.tiles[x][y];
		} else {
			return undefined;
		}
	}

	GetMooreNeighbourhood(x, y) { // returns [N, S, W, E]
		return [
			this.GetTile(x, y - 1), // N
			this.GetTile(x, y + 1), // S
			this.GetTile(x - 1, y), // W
			this.GetTile(x + 1, y) // E
			];
	}

	// tells whether a tile is adjacent to another tile that follows an arbitrary criterion
	IsAdjacentTo(x, y, fn)  {
		var c = this.GetMooreNeighbourhood(x, y);
		return (c[0] !== undefined && fn(c[0])) ||
			   (c[1] !== undefined && fn(c[1])) ||
			   (c[2] !== undefined && fn(c[2])) ||
			   (c[3] !== undefined && fn(c[3]));
	}

	Update(dt) {
		this.buildings.forEach((building) => {
			building.Update(dt)
		});
	}

	DrawTile(x, y, layer, hover_coords, tool) {
		if (utils.isTileVisibleOnScreen(x,y)) {
			var tile = this.GetTile(x, y)
			tile.Draw(x, y, {layer : layer})

			if (tile.building !== undefined) {
				tile.building.Draw(layer);
			}	
			if (hover_coords.x == x && hover_coords.y == y) {
				// draw the hover
				drawTool(x, y, tool);
			}
		}
	}

	Draw(hover_coords) {
		var tool = tools[current_tool];
		// for (every layer
		for (var layer=0; layer < 2; ++layer) {
			// draw the upper half
			for (var i = 0; i < this.size; ++i) {
				for (var j = 0; j < i; ++j) {
					var x = this.size - i + j - 1;
					var y = j;
					this.DrawTile(x, y, layer, hover_coords, tool);
				}
			}
			// draw the lower half 
			for (var i = this.size - 1; i >= 0; --i) {
				for (var j = 0; j < i; ++j) {
					var x = j;
					var y = this.size - i + j - 1;
					this.DrawTile(x, y, layer, hover_coords, tool)
				}
			}
		}
	}
}

