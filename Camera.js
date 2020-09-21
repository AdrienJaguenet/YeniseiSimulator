class Camera
{
	constructor() {
		this.x = 0;
		this.y = 0;
		this.zoom = 2;
		this.currShakeAmount = 0;
		this.shakeThreshold = 0.2;
		this.shakeDamping = 20;
		this.offset = {
			x : 0,
			y : 0
		};
	}

	Update(dt) {
		handleMovement(dt)
		this.offset = {
			x : Math.random(-1, 1) * this.currShakeAmount,
			y : Math.random(-1, 1) * this.currShakeAmount
		}
		if (camera.currShakeAmount > this.shakeThreshold) {
			this.currShakeAmount = this.currShakeAmount - this.currShakeAmount * this.shakeDamping * dt;
		} else {
			this.currShakeAmount = 0;
		}
	}

	CenterOnMouse() {
	}


	Zoom(factor, isox, isoy) {
		this.zoom = this.zoom * factor
	}

	Shake(amount) {
		this.currShakeAmount = amount
	}

}

function handleMovement(dt) {
	if (mouse.x < canvasdim.width / 100) {
		camera.x += settings.CAMERA_SPEED * dt * (1 / camera.zoom)
	} else if (mouse.x > 99 * canvasdim.height / 100) {
		camera.x -= settings.CAMERA_SPEED * dt * (1 / camera.zoom)
	}

	if (mouse.y < canvasdim.height / 100) {
		camera.y += settings.CAMERA_SPEED * dt * (1 / camera.zoom)
	} else if (mouse.y > 99 * canvasdim.height / 100) {
		camera.y -= settings.CAMERA_SPEED * dt * (1 / camera.zoom)
	}
}

