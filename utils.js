var utils = {
	iso2screen : function(i, j) {
		return {
			x : (((i + j + 2) * settings.ISOTILE_WIDTH / 2) + camera.x) * camera.zoom,
			y : ((-settings.ISOTILE_HEIGHT/2 + j * settings.ISOTILE_HEIGHT / 2 - i * settings.ISOTILE_HEIGHT / 2) + camera.y) * camera.zoom
		}
	},

	screen2iso : function(cx, cy) {
		cx = (cx / camera.zoom - camera.x)
		cy = (cy / camera.zoom - camera.y)
		var x0 =  cx * (settings.ISOTILE_HEIGHT / settings.ISOTILE_WIDTH)
		var y0 =  -cx * (settings.ISOTILE_HEIGHT / settings.ISOTILE_WIDTH)

		return {
			x : (x0 - cy) / settings.ISOTILE_HEIGHT - 1,
			y : (cy - y0) / settings.ISOTILE_HEIGHT - 1
		}
	},

	updateDate : function(dt) {
		date_accu = dt + date_accu;
		while (date_accu > .5) { 
			date_accu -= .5;
			date.setDate(date.getDate() + 1);
		}
	},

	isTileVisibleOnScreen : function(i,j) {
		var wh = canvas.getBoundingClientRect();
		var width = wh.width, height = wh.height;
		var draw_origin = utils.iso2screen(i, j);
		var x = (draw_origin.x + camera.offset.x);
		var y = (draw_origin.y + camera.offset.y);
		return (x > -100 && x < width) && (y > -100 && y < height);
	}
}
    
