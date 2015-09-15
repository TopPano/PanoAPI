/**
 * Toppano Panorama Viewer API
 * Panorama Function
 */

// snapshot canvas drawing initialization
TOPPANO.snapshotCanvasInit = function() {
	TOPPANO.drawCanvas();
	var canvas = document.getElementById('myCanvas');
	// fadeIn(canvas, 600);
	hide(canvas);
};

// main menu initialization
TOPPANO.menuInit = function() {
	var downloadLink = document.getElementById('downLink');
	hide(downloadLink);
};

// print out ERROR messages
TOPPANO.printError = function (errorMsg) {
	console.log('Error: ' + errorMsg);
};