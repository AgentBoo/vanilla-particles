// resources
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations
// https://www.html5rocks.com/en/tutorials/canvas/performance/

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const { height, width } = canvas.parentElement.getBoundingClientRect()

canvas.width = width 
canvas.height = height 

canvas.ctx = ctx 
 
// https://stackoverflow.com/a/5365036
function randomColor(){
	return "#" + ((1<<24)*Math.random()|0).toString(16)
} 

canvas.ctx.fillStyle = randomColor()

class Ball{
	constructor(canvas){
		this.x = Math.random() * canvas.width  
		this.y = Math.random() * canvas.height 
		this.m = Math.random() * 10
		this.dx = Math.random() * 0.5 
		this.dy = Math.random() * 0.5
	}

	get radius(){
		return this.m 
	}

	draw(){
		canvas.ctx.beginPath()
		canvas.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		canvas.ctx.fill()
	}

	displace(){
		this.x += this.dx * 2
		this.y += this.dy * 3

		if(this.x + this.radius + this.dx > canvas.width || this.x + this.radius + this.dx < 2 * this.radius){
			this.dx = -this.dx 
		}

		if(this.y + this.radius + this.dy > canvas.height || this.y + this.radius + this.dy < 2 * this.radius){
			this.dy = -this.dy 
		}
	}
}

let balls = []

for(let i = 0; i < 10; i++){
	balls.push(new Ball(canvas))
}

// render
let frame; 

function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	for(let i = 0; i < balls.length; i++){
		balls[i].draw()
		balls[i].displace()
	}

	frame = window.requestAnimationFrame(render)
}

// start on click
// accelerate on subsequent clicks 
document.addEventListener('click', e => {
	e.preventDefault()	
	frame = window.requestAnimationFrame(render)
})

