// resources
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations
// https://www.html5rocks.com/en/tutorials/canvas/performance/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const { height, width } = canvas.parentElement.getBoundingClientRect();

canvas.width = width;
canvas.height = height;

canvas.ctx = ctx;

// https://stackoverflow.com/a/5365036
function randomColor() {
	return "#" + (((1 << 24) * Math.random()) | 0).toString(16);
}

function square(number) {
	return number * number;
}

class Ball {
	constructor(canvas, init) {
		this.mass = Math.random() * 4 + 2;
		this.x = init.x || Math.random() * (canvas.width - 40) + 20; // position X
		this.y = init.y || Math.random() * (canvas.height - 40) + 20; // position Y
		this.vx = init.vx || Math.random() * 0.4 + 0.2; // velocity X
		this.vy = init.vy || Math.random() * 0.4 + 0.2; // velocity Y

		this.growth = {
			enabled: true,
			radius: 0.1,
			rate: 1 / this.mass,
			factor: 3
		};
	}

	// the heavier the ball, the larger the radius

	get radius() {
		if (this.growth.enabled) {
			return this.growth.radius;
		} else {
			return this.mass;
		}
	}

	get diameter() {
		return 2 * this.radius;
	}

	get outOfBoundsX() {
		return (
			this.x + this.radius + this.vx > canvas.width ||
			this.x + this.radius + this.vx < this.diameter
		);
	}

	get outOfBoundsY() {
		return (
			this.y + this.radius + this.vy > canvas.height ||
			this.y + this.radius + this.vy < this.diameter
		);
	}

	stopGrowth() {
		this.growth.enabled = false;
	}

	squareDistanceTo(neighbour) {
		return square(this.x - neighbour.x) + square(this.y - neighbour.y);
	}

	grow() {
		if (this.growth.radius >= this.mass) {
			return this.stopGrowth();
		} else {
			this.growth.radius += this.growth.rate / this.growth.factor;
		}
	}

	draw() {
		if (this.growth.enabled) {
			this.grow();
		}

		canvas.ctx.beginPath();
		canvas.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		canvas.ctx.fillStyle = "black";
		canvas.ctx.fill();
	}

	displace() {
		this.x += this.vx;
		this.y += this.vy;

		if (this.outOfBoundsX) {
			this.vx = -this.vx;
		}

		if (this.outOfBoundsY) {
			this.vy = -this.vy;
		}
	}
}

function createBalls(N){
	let balls = []

	for (let i = 0; i < N; i++) {
		balls.push(new Ball(canvas, {}));
	}

	return balls
}

let balls = createBalls(8)

// render
let frame;

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < balls.length; i++) {
		let particle = balls[i];

		if (balls.length < 50) {
			for (let j = i + 1; j < balls.length; j++) {
				let neighbour = balls[j];

				let sqdist = particle.squareDistanceTo(neighbour) 

 				if (sqdist <= square(particle.radius + neighbour.radius)) {
					//particle.vx = -particle.vx;
					particle.vy = -particle.vy;
					//neighbour.vx = -neighbour.vx;
					neighbour.vy = -neighbour.vy;

					console.log(particle);
					console.log(neighbour);
				}
			}
		} else {
			continue;
		}
	}

	//  

	for (let i = 0; i < balls.length; i++) {
		balls[i].draw();
		balls[i].displace();
	}

	frame = window.requestAnimationFrame(render);
}

// start on click
// todo: accelerate on subsequent clicks

let clicked = false;

document.addEventListener("click", e => {
	e.preventDefault();
	if (clicked) {
		window.cancelAnimationFrame(frame);
	} else {
		frame = window.requestAnimationFrame(render);
	}
	clicked = !clicked;
});
