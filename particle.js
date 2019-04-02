import { KCONST, DAMPING, magnitude } from "./utils.js";

export class Particle {
	constructor(scene, init) {
		this.canvas = scene.canvas;
		this.ctx = scene.ctx;

		this.spawn(init);
		this.lightIncrement = 0.02;
		this.growth = {
			enabled: true,
			radius: 0.1,
			rate: 1 / this.m,
			factor: 20
		};
	}

	/* prettier-ignore */
	spawn(init = {}) {
		// all default values are guess-check-revised
		// the heavier the particle, the larger the radius
		this.m 	= init.m  || Math.random() * 2.8 + 0.4; // mass;
		this.x 	= init.x  || Math.random() * (this.canvas.width - 40) + 20; // position X
		this.y 	= init.y  || Math.random() * (this.canvas.height - 40) + 20; // position Y
		this.vx = init.vx || Math.random() * 0.4 - 0.2; // velocity X
		this.vy = init.vy || Math.random() * 0.4 - 0.2; // velocity Y
		
		this.color = init.color || [255, 255, 255];
		this.light = Math.random() * 0.8 + 0.2;
		this.lifespan = 2000 * this.m;
	}

	get radius() {
		if (this.growth.enabled) {
			return this.grow();
		} else {
			return this.m;
		}
	}

	get opacity() {
		if (this.light > 1 || this.light < 0.3) {
			this.lightIncrement = -this.lightIncrement;
		}

		return (this.light += this.lightIncrement);
	}

	get outOfBoundsX() {
		return (
			this.x + this.vx + this.radius > this.canvas.width ||
			this.x + this.vx + this.radius < 2 * this.radius
		);
	}

	get outOfBoundsY() {
		return (
			this.y + this.vy + this.radius > this.canvas.height ||
			this.y + this.vy + this.radius < 2 * this.radius
		);
	}

	grow() {
		if (this.growth.radius >= this.m) {
			this.growth.enabled = false;
			return this.growth.radius;
		} else {
			/* prettier-ignore */
			return (this.growth.radius += this.growth.rate / this.growth.factor);
		}
	}

	draw() {
		if (this.lifespan <= 0) {
			this.spawn();
		}

		const [r, g, b] = this.color;

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		this.ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
		this.ctx.fill();

		this.lifespan--;
	}

	drawLineTo(neighbor, force) {
		const opacity = force < 1 ? force : 1;

		this.ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		this.ctx.lineTo(neighbor.x, neighbor.y);
		this.ctx.stroke();
	}

	displace() {
		if (this.outOfBoundsX) {
			this.vx = -this.vx;
		}

		if (this.outOfBoundsY) {
			this.vy = -this.vy;
		}

		if (this.vx > 0.4 && this.vy > 0.4) {
			this.vx *= DAMPING;
			this.vy *= DAMPING;
		}

		// constant velocity/displacement
		this.x += this.vx;
		this.y += this.vy;
	}

	/* prettier-ignore */
	accelerateTo(neighbor, force) {
		// distance diff on each axis
		const dx = neighbor.x - this.x;
		const dy = neighbor.y - this.y;

		// distance magnitude
		const dist = magnitude([dx, dy]);

		// direction on each axis
		const ux = dx / dist;
		const uy = dx / dist;

		// accelerating A => B:
		// if subtracting A from B to get distance diff,
		// then add acceleration to A and subtract from B

		// scale down the force by 1000, otherwise particles go crazy
		this.vx 	+= ux * force / this.m * 0.001;
		this.vy 	+= uy * force / this.m * 0.001;
		neighbor.vx -= ux * force / neighbor.m * 0.001;
		neighbor.vy -= uy * force / neighbor.m * 0.001;
	}

	/* prettier-ignore */
	springTo(neighbor) {
		// distance diff on each axis
		const dx = neighbor.x - this.x;
		const dy = neighbor.y - this.y;

		// hooks' law => force on each axis
		let fx = KCONST * dx;
		let fy = KCONST * dy;

		// accelerating/pushing A => B:
		// if subtracting A from B to get distance diff,
		// then add acceleration to A and subtract from B

		// add half acceleration to me, and substract it from thee
		this.vx 	+= fx / this.m * 0.5;
		this.vy 	+= fy / this.m * 0.5;
		neighbor.vx -= fx / neighbor.m * 0.5;
		neighbor.vy -= fy / neighbor.m * 0.5;
	}

	/* prettier-ignore */
	bounceOff(neighbor) {
		this.vx 	= -this.vx;
		this.vy 	= -this.vy;
		neighbor.vx = -neighbor.vx;
		neighbor.vy = -neighbor.vy;
	}
}
