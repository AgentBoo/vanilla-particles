export const GCONST = 66.74; // gravitational constant (guess-check-revised number)
export const KCONST = 0.001; // spring constant
export const DAMPING = 0.95;

export function noop() {
	return {};
}

export function magnitude([lengthX, lengthY]) {
	return Math.sqrt(lengthX * lengthX + lengthY * lengthY);
}

// gravitation/gravitational force/gravitational attraction
export function gravitation(objA, objB) {
	const dx = objA.x - objB.x;
	const dy = objA.y - objB.y;

	// square distance
	const sqdist = dx * dx + dy * dy;

	// newton's gravitational law => gravitational force
	return (GCONST * objA.m * objB.m) / sqdist;
}
