/**
 * Toppano Panorama Viewer API
 * View Function
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
	var fading = window.setInterval(function() {
		opacity += opaDelta;
	    obj.style.opacity = opacity;
	    if(obj.style.opacity >= 1) {
	      window.clearInterval(fading);
	      obj.style.opacity = 1;
	    }
	}, speed);
}

function fadeOut(obj, ms) {
	var speed = 20,
	delay = ms / speed,
	opaDelta = speed / ms;

	var opacity = 1;
	obj.style.opacity = opacity;
	var fading = window.setInterval(function() {
		opacity -= opaDelta;
	    obj.style.opacity = opacity;
	    if(obj.style.opacity <= 0) {
	      window.clearInterval(fading);
	      obj.style.opacity = 0;
	    }
	}, speed);
}

function preventDefaultBrowser(event) {
    // Chrome / Opera / Firefox
    if (event.preventDefault)
        event.preventDefault();
    // IE 9
    event.returnValue = false;
}

function isEmpty(str) {
    return (!str || 0 === str.length || /^\s*$/.test(str));
}

function sleep(ms) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > ms) {
            break;
        }
    }
}

function clamp(number, min, max) {
    return number > max ? max : (number < min ? min : number);
}