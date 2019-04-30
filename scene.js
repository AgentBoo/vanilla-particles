import { Particle } from "./particle.js";
import { noop, gravitation } from "./utils.js";

const maxFPS = 60;
const timestep = 1000 / maxFPS;

const seedcount = 50;
const seedmax = seedcount * 2;

export class Scene {
	constructor(canvas, observer, monitor) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		this.particles = [];

		this.started = false;
		this.running = false;
		this.frameID = null;
		this.dt = 0 
		this.lastFrameTimeMs = 0
		this.frameCount = 0
		this.fps = 0
		this.monitor = monitor
		this.observer = observer;
		this.addListeners();
	}

	addListeners() {
		this.canvas.addEventListener("click", event => {
			event.preventDefault();

			if (!this.running) {
				return;
			}

			if (this.particles.length <= seedmax) {
				this.particles.push(
					new Particle(this, {
						// offset mouse position to make it look like
						// particles come out of mouse's tip
						x: event.pageX - 10,
						y: event.pageY - 10,
						// set random fast 'up' direction
						vy: Math.random() * 5 + -10,
						color: [255, 0, 0]
					})
				);

				// mousenode is added to particles[] on canvas's mouseenter,
				// but mousenode isn't a 'real' particle, so -1
				this.observer.innerHTML = this.particles.length - 1;
			}
		});

		this.canvas.addEventListener("mouseenter", _ => {
			const mouseNode = new Particle(this, {
				x: event.pageX,
				y: event.pageY,
				m: 10
			});
			mouseNode.spawn = noop;
			mouseNode.displace = noop;
			mouseNode.draw = noop;

			// put mousenode at the beginning of the particles[]
			this.particles.unshift(mouseNode);

			// only do these on mouseenter
			this.canvas.addEventListener("mousemove", _ => {
				mouseNode.x = event.pageX;
				mouseNode.y = event.pageY;
			});

			this.canvas.addEventListener("mouseleave", _ => {
				this.particles.splice(0, 1);
			});
		});
	}

	start() {
		if (!this.started) {
			this.started = true;
			this.seed(seedcount);
			this.observer.innerHTML = this.particles.length;
		}

		// I don't really care about drawing the very first
		// frame before any displacement updates occur

		this.running = true;
		this.render();
	}

	stop() {
		this.running = false;
		window.cancelAnimationFrame(this.frameID);
	}

	seed(quantity) {
		for (let i = 0; i < quantity; i++) {
			this.particles.push(new Particle(this));
		}
	}

	resize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	paintFrames() {
		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].displace();
			this.particles[i].draw();
		}
	}

	handleInteractions() {
		for (let i = 0; i < this.particles.length - 1; i++) {
			for (let j = 1 + i; j < this.particles.length; j++) {
				let particle = this.particles[i];
				let neighbor = this.particles[j];

				let gforce = gravitation(particle, neighbor);

				// guess-check-revised number
				if (gforce < 0.04) {
					continue;
				} else {
					particle.springTo(neighbor, gforce);
					particle.drawLineTo(neighbor, gforce);
				}
			}
		}
	}

	render(now) {
		if (!this.running) {
			return;
		}

		// TODO: FPS limit logic
		// http://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing

		let delta = this.dt 
		delta = (now - this.lastFrameTimeMs)/1000 
		this.lastFrameTimeMs = now

		this.fps = Math.round(1/delta)

		this.clearCanvas();
		this.handleInteractions();
		this.paintFrames();

		// set correct context for `this`
		// https://stackoverflow.com/a/34930859
		this.frameID = window.requestAnimationFrame(timestamp => this.render(timestamp));
	}
}
