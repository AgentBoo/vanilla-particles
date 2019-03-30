// tutorial 
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const { height, width } = canvas.parentElement.getBoundingClientRect()

canvas.width = width 
canvas.height = height 

ctx.fillStyle = '#222'

canvas.ctx = ctx 

class Ball{
	constructor(canvas){
		this.x = 200
		this.y = 200
		this.m = 10
		this.dx = 10 
		this.dy = 10 
	}

	get radius(){
		return this.m 
	}

	draw(){
		canvas.ctx.beginPath()
		canvas.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		canvas.ctx.fill()
	}
}

// ball instance
let ball = new Ball(canvas)

// render
let frame; 

function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ball.draw()

	ball.x += ball.dx 
	ball.y += ball.dy 

	if(ball.x + ball.dx > canvas.width || ball.x + ball.dx < 0){
		ball.dx = -ball.dx 
	}

	if(ball.y + ball.dy > canvas.height || ball.y + ball.dy < 0){
		ball.dy = -ball.dy 
	}

	frame = window.requestAnimationFrame(render)
}

// start on click
// accelerate on subsequent clicks 
document.addEventListener('click', e => {
	e.preventDefault()	
	frame = window.requestAnimationFrame(render)
})

ball.draw()