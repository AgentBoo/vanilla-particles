// resources
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations
// https://www.html5rocks.com/en/tutorials/canvas/performance/

function square(number) {
	return number * number;
}

function magnitude(vector) {
	return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
}

function configure(canvasId) {
	const canvas = document.getElementById(canvasId);
	const ctx = canvas.getContext("2d");

	const { height, width } = canvas.parentElement.getBoundingClientRect();

	canvas.ctx = ctx;
	canvas.width = width;
	canvas.height = height;
	canvas.fillStyle = "black";
	canvas.strokeStyle = "black";

	return canvas;
}

function distance(objA, objB) {
	return Math.sqrt(sqdistance(objA, objB));
}

function sqdistance(objA, objB) {
	const dx = objA.x - objB.x;
	const dy = objA.y - objB.y;
	return dx * dx + dy * dy;
}

function gforce(objA, objB) {
	// 2 is an arbitrary constant
	return (2 * (objA.m * objB.m)) / sqdistance(objA, objB);
}

class Particles {
	constructor(canvas) {
		this.canvas = canvas;
		this.particles = [];

		this.started = false;
		this.running = false;
		this.frameId = null;

		this.registerCreate();
	}

	registerCreate() {
		document.addEventListener("click", event => {
			if (this.particles.length < 50) {
				this.particles.push(
					new Ball(this.canvas, {
						x: event.pageX,
						y: event.pageY,
						vy: Math.random() * -3 - 1.2
					})
				);
			}
		});
	}

	start() {
		if (!this.started) {
			this.started = true;
			this.seed(20);
		}

		this.running = true;
		this.render();
	}

	stop() {
		this.running = false;
	}

	seed(N) {
		for (let i = 0; i < N; i++) {
			this.particles.push(new Ball(this.canvas, {}));
		}
	}

	render() {
		if (!this.running) {
			return;
		}

		const { ctx } = this.canvas;

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].draw();
			this.particles[i].displace();
		}

		for (let i = 0; i < this.particles.length - 1; i++) {
			for (let j = 1 + i; j < this.particles.length; j++) {
				let particle = this.particles[i];
				let neighbor = this.particles[j];

				let reach = sqdistance(particle, neighbor);

				// connect everyone with everyone 
				// opacity changes for all lines at once
				let force;
				
				if (reach < 100) {
					force = gforce(particle, neighbor);
				}

				let opacity = force > 1 ? 1 : force;
				ctx.strokeStyle = `rgba(0,0,0, ${opacity})`;
				ctx.beginPath();
				ctx.moveTo(neighbor.x, neighbor.y);
				ctx.lineTo(particle.x, particle.y);
				ctx.stroke();
			}
		}

		// set correct context for `this`
		// https://stackoverflow.com/a/34930859
		this.frameId = window.requestAnimationFrame(timestamp => this.render());
	}
}

class Dot {
	constructor(canvas, coordX, coordY) {
		this.x = coordX;
		this.y = coordY;
		this.ctx = canvas.getContext("2d");
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2, true);
		this.ctx.fillStyle = "red";
		this.ctx.fill();
	}
}

class Ball {
	constructor(canvas, init) {
		this.canvas = canvas;

		this.m = 4; // mass; the heavier the ball, the larger the radius
		this.x = init.x || Math.random() * (canvas.width - 40) + 20; // position X
		this.y = init.y || Math.random() * (canvas.height - 40) + 20; // position Y
		this.vx = init.vx || Math.random() * 0.8 - 0.2; // velocity X
		this.vy = init.vy || Math.random() * 0.8 - 0.2; // velocity Y

		this.growth = {
			enabled: init.growth,
			radius: 0.1,
			rate: 1 / this.m,
			factor: 20
		};
	}

	get radius() {
		if (this.growth.enabled) {
			return this.grow();
		} else {
			return this.m;
		}
	}

	get diameter() {
		return 2 * this.radius;
	}

	get outOfBoundsX() {
		return (
			this.x + this.vx + this.radius > canvas.width ||
			this.x + this.vx + this.radius < this.diameter
		);
	}

	get outOfBoundsY() {
		return (
			this.y + this.vy + this.radius > canvas.height ||
			this.y + this.vy + this.radius < this.diameter
		);
	}

	grow() {
		if (this.growth.radius >= this.m) {
			this.growth.enabled = false;
		} else {
			this.growth.radius += this.growth.rate / this.growth.factor;
		}

		return this.growth.radius;
	}

	draw() {
		this.canvas.ctx.beginPath();
		this.canvas.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		this.canvas.ctx.fill();
	}

	displace() {
		if (this.outOfBoundsX) {
			this.vx = -this.vx;
		}

		if (this.outOfBoundsY) {
			this.vy = -this.vy;
		}

		this.x += this.vx;
		this.y += this.vy;
	}
}

/* __main__ */

let canvas = configure("canvas");
let simulation = new Particles(canvas);

simulation.start();

let button = document.getElementById("controlBtn");

button.addEventListener("click", event => {
	event.preventDefault();

	if (simulation.running) {
		simulation.stop();
	} else {
		simulation.start();
	}
});
