/**
 * Toppano Panorama Viewer API
 */

// using jQuery
$(function () {

	// drawing snapshot canvas
	TOPPANO.drawCanvas = function() {
		var canvas = $('#mycanvas');
		canvas.fadeIn(100);
        canvas = document.getElementById('mycanvas');
        canvas.height = window.innerHeight * 0.8;
        canvas.width = window.innerWidth * 0.8;

        var rectPos = {
        	x: 0,
        	y: 0,
        	width: window.innerWidth * 0.8,
        	height: window.innerHeight * 0.8
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
        	centerX: window.innerWidth * 0.4,
        	centerY: window.innerHeight * 0.4,
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

	TOPPANO.drawCanvas();
});
