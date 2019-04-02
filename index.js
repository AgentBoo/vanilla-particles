import { Scene } from "./scene.js";

function configure(canvasId) {
	const canvas = document.getElementById(canvasId);

	const { height, width } = canvas.parentElement.getBoundingClientRect();

	canvas.width = width;
	canvas.height = height;

	return canvas;
}

/* __main__ */

let observer = document.getElementById("observer");
let button = document.getElementById("controlBtn");
let reset = document.getElementById("resetBtn");

let canvas = configure("canvas");
let simulation = new Scene(canvas, observer);

simulation.start();

button.addEventListener("click", event => {
	event.preventDefault();
	if (simulation.running) {
		simulation.stop();
	} else {
		simulation.start();
	}
});

reset.addEventListener("click", event => {
	event.preventDefault();
	simulation.particles = [];
	observer.innerHTML = simulation.particles.length;
});
