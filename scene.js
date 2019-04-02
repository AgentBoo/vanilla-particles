import { Particle } from "./particle.js";
import { noop, gravitation } from "./utils.js";

const seedcount = 50;
const seedmax = seedcount * 2;

export class Scene {
	constructor(canvas, observer) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		this.particles = [];

		this.started = false;
		this.running = false;
		this.frameId = null;

		this.observer = observer;
		this.addListeners();
	}

	addListeners() {
		this.canvas.addEventListener("click", event => {
			event.preventDefault();

			if (!this.running){
				return 
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

		this.running = true;
		this.render();
	}

	stop() {
		this.running = false;
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

	drawParticles() {
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

	render() {
		if (!this.running) {
			return;
		}

		this.clearCanvas();
		this.handleInteractions();
		this.drawParticles();

		// set correct context for `this`
		// https://stackoverflow.com/a/34930859
		this.frameId = window.requestAnimationFrame(timestamp => this.render());
	}
}
