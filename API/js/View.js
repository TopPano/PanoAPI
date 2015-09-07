/**
 * Toppano Panorama Viewer API
 */

// drawing snapshot canvas
TOPPANO.drawCanvas = function() {
    var canvas = document.getElementById('myCanvas');
    fadeIn(canvas, 500);
    canvas.style.position = "fixed";
    canvas.style.left = "10%";
    canvas.style.height = window.innerHeight * 0.8;
    canvas.style.width = window.innerWidth * 0.8;

    var rectPos = {
    	x: 10,
    	y: 10,
    	width: window.innerWidth * 0.8 + 10,
    	height: window.innerHeight * 0.8 + 10
    },
    rectStyle = {
    	lineWidth: 7,
    	color: {
    		r: 255,
    		g: 255,
    		b: 255,
    		a: 0.6
    	}
    },
    crossPos = {
    	centerX: window.innerWidth * 0.4 + 10,
    	centerY: window.innerHeight * 0.4 + 10,
    	width: 60,
    	height: 60
    },
    crossStyle = {
    	lineWidth: 7,
    	color: {
    		r: 255,
    		g: 255,
    		b: 255,
    		a: 0.6
    	}
    };
    drawRect(canvas, rectPos, rectStyle);
    drawCross(canvas, crossPos, crossStyle);
};

function drawRect(canvas, pos, style) {
	var context = canvas.getContext('2d');
	context.beginPath();
    context.rect(pos.x, pos.y, pos.width, pos.height);
    context.lineWidth = style.lineWidth;
    context.strokeStyle = 'rgba(' + style.color.r +', ' + style.color.g + ', ' + style.color.b + ', ' + style.color.a + ')';
    context.stroke();
}

function drawCross(canvas, pos, style) {
	var context = canvas.getContext('2d');
	context.beginPath();
    context.moveTo(pos.centerX - 0.5 * pos.width, pos.centerY);
    context.lineTo(pos.centerX + 0.5 * pos.height, pos.centerY);
    context.moveTo(pos.centerX, pos.centerY - 0.5 * pos.width);
    context.lineTo(pos.centerX, pos.centerY + 0.5 * pos.height);
    context.lineWidth = style.lineWidth;
    context.strokeStyle = 'rgba(' + style.color.r +', ' + style.color.g + ', ' + style.color.b + ', ' + style.color.a + ')';
    context.stroke();
}

function fadeIn(obj, ms) {
	var speed = 20,
	delay = ms / speed,
	opaDelta = speed / ms;

	var opacity = 0;
	obj.style.opacity = opacity;

	function func() {
		opacity += opaDelta;
	    obj.style.opacity = opacity;
	    if(obj.style.opacity >= 1) {
	      window.clearInterval(fading);
	      obj.style.opacity = 1;
	    }
	}
	var fading = window.setInterval(func, speed);
}

function fadeOut(obj, ms) {
	var speed = 20,
	delay = ms / speed,
	opaDelta = speed / ms;

	var opacity = 1;
	obj.style.opacity = opacity;

	function func() {
		opacity -= opaDelta;
	    obj.style.opacity = opacity;
	    if(obj.style.opacity <= 0) {
	      window.clearInterval(fading);
	      obj.style.opacity = 0;
	    }
	}
	var fading = window.setInterval(func, speed);
}