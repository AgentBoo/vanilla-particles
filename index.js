import { Scene } from "./scene.js";

const { devicePixelRatio } = window;

function configure(canvasId) {
	const canvas = document.getElementById(canvasId);

	const { height, width } = canvas.parentElement.getBoundingClientRect();

	// scale canvas if displayed on retina screen
	// https://github.com/pakastin/nodegarden/blob/master/scripts/nodegarden.js#L15
	/*
	if (devicePixelRatio && devicePixelRatio !== 1) {
		canvas.style.transform = `scale(${1 / devicePixelRatio})`;
		canvas.style.transformOrigin = "0 0";
	}
	*/
	canvas.width = width;
	canvas.height = height;

	return canvas;
}

/* __main__ */
let monitor = document.getElementById("monitor")
let observer = document.getElementById("observer");
let button = document.getElementById("controlBtn");
let reset = document.getElementById("resetBtn");

let canvas = configure("canvas");
let simulation = new Scene(canvas, observer, monitor);

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

setInterval(() => {
	monitor.innerHTML = `${performance.now()} ${simulation.fps} fps` 
}, 500)

simulation.start();