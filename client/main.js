var gfx = undefined;
var sfx = undefined;
var terrain = undefined;
var ctx = undefined;
var canvas = undefined;
var building_selected = undefined;

var client = new Colyseus.Client('ws://localhost:3000');
let allRooms = [];

var terrain_tilemap = new Image();
var mouse = {
	x : 0,
	y : 0
};
var canvasdim = {
	width : 640,
	height : 480
}

async function load() {
	canvas = document.getElementById('main-canvas');
	ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	camera = new Camera();
	gfx = {
		tiles : loadTiles()
	};
	sfx = {
		build : newAudio('resources/sfx/build.wav'),
		err : newAudio('resources/sfx/error.wav')
	};
	loadBuildings();
	terrain = new Terrain()

	setInterval(update, 20);
	setInterval(draw, 20);

	canvas.onwheel = canvasWheel;
	canvas.onkeypressed = canvasKey;
	canvas.onclick = canvasClick;
	canvas.onmousemove = canvasMouseMove;

	client.joinOrCreate('game_room').then(room => {
		console.log(room)
		document.getElementById('room-id').innerHTML = room.id;
		room.onStateChange.once((state) => {
			// This is where we get the initial full state ready
			terrain.FromState(state)
		});
	}).catch(e => {
		document.getElementById('room-id').innerHTML = 'NONE ('+e+')';	
	});
}


var settings = {
	MAP_SIZE : 50,
	CAMERA_SPEED : 500,
	ISOTILE_HEIGHT : 20,
	ISOTILE_WIDTH : 32,
	VERSION : '0.0.2-bosei',
	DEBUG : true,
	FULLSCREEN : true
};

resources = {
	workers : 1,
	used_workers : 0,
	food : 1000,
	power : 0
}

var date = new Date('1953-03-05');

var date_accu = 0;

function newAudio(src) {
	var audio = new Audio();
	audio.src = src;
	return audio;
}

function update(dt) {
	dt = 0.02;
	utils.updateDate(dt)
	terrain.Update(dt)
	camera.Update(dt)
}

function draw() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvasdim.width, canvasdim.height);
	var hover_coords = utils.screen2iso(mouse.x, mouse.y);
	hover_coords.y = Math.floor(hover_coords.y);
	hover_coords.x = Math.floor(hover_coords.x);
	document.getElementById('iso-coords').innerHTML = hover_coords.x+', '+hover_coords.y;
	document.getElementById('camera-coords').innerHTML = camera.x+', '+camera.y;
	document.getElementById('workers-free').innerHTML = ''+resources.workers - resources.used_workers;
	document.getElementById('workers-total').innerHTML = ''+resources.workers;
	terrain.Draw(hover_coords);
}

function canvasMouseMove(evt) {
	var br = canvas.getBoundingClientRect();
	mouse.x = evt.clientX - br.x;
	mouse.y = evt.clientY - br.y;
}

function canvasClick(evt) {
	var iso = utils.screen2iso(mouse.x, mouse.y);
	var tool = tools[current_tool];
	iso.x = Math.floor(iso.x);
	iso.y = Math.floor(iso.y);
	if (building_selected === undefined &&
	    iso.x >= 0 && iso.x < settings.MAP_SIZE && iso.y >= 0 && iso.y < settings.MAP_SIZE) {

		if (tool.canUse(iso.x, iso.y)) {
			tool.use(iso.x, iso.y);
		} else {
			sfx.err.pause();
			sfx.err.currentTime = 0;
			sfx.err.play();
			camera.Shake(2);
		}
	}

}

function canvasKey(evt) {
	var k = evt.code;

	if (k == 'space') {
		camera.CenterOnMouse()
	}
}

function canvasWheel(evt) {
	if (evt.deltaY > 0) {
		camera.Zoom(0.5, mouse.x, mouse.y)
	} else if (evt.deltaY < 0) {
		camera.Zoom(2, mouse.x, mouse.y)
	}
}

