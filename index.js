// tutorial 
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const { height, width } = canvas.parentElement.getBoundingClientRect()

canvas.width = width 
canvas.height = height 

// 
let ball = {
	x: 200,
	y: 200,
	r: 10,
	color: 'red',
	draw: function(){
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
		ctx.fillStyle = this.color
		ctx.fill()
	}
}

ball.draw()