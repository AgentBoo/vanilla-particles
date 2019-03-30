// tutorial 
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const { height, width } = canvas.parentElement.getBoundingClientRect()

canvas.width = width 
canvas.height = height 

// ball instance
let ball = {
	x: 200,
	y: 200,
	r: 10,
	vx: 5,
	vy: 5,
	color: 'red',
	draw: function(){
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
		ctx.fillStyle = this.color
		ctx.fill()
	}
}

// render
let frame; 

function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ball.draw()

	ball.x += ball.vx 
	ball.y += ball.vy 

	frame = window.requestAnimationFrame(render)
}

// start on click 
document.addEventListener('click', e => {
	e.preventDefault()	
	frame = window.requestAnimationFrame(render)
})

ball.draw()