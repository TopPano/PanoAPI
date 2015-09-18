/**
 * Toppano Panorama Viewer API
 * Listener Function
 */

TOPPANO.onDocumentMouseDown = function() {
	console.log('MouseDown');
	preventDefaultBrowser(event);

	TOPPANO.gv.interact.isUserInteracting = true;

	TOPPANO.gv.interact.onPointerDownPointerX = event.clientX;
	TOPPANO.gv.interact.onPointerDownPointerY = event.clientY;

	TOPPANO.gv.interact.onPointerDownLon = TOPPANO.gv.cam.lon;
	TOPPANO.gv.interact.onPointerDownLat = TOPPANO.gv.cam.lat;
};

TOPPANO.onDocumentMouseMove = function() {
	console.log('MouseMove');

	if (TOPPANO.gv.interact.isUserInteracting) {
		var deltaX = TOPPANO.gv.interact.onPointerDownPointerX - event.clientX,
		deltaY = event.clientY - TOPPANO.gv.interact.onPointerDownPointerY;

		TOPPANO.gv.cam.lon = deltaX * 0.1 + TOPPANO.gv.interact.onPointerDownLon;
		TOPPANO.gv.cam.lat = deltaY * 0.1 + TOPPANO.gv.interact.onPointerDownLat;
	}

	// check if hover something, change the icon color
};

TOPPANO.onDocumentMouseUp = function() {
	console.log('MouseUp');
};

TOPPANO.onDocumentMouseWheel = function() {
	console.log('MouseWheel');
};

TOPPANO.onDocumentTouchStart = function() {
	console.log('TouchStart');
};

TOPPANO.onDocumentTouchMove = function() {
	console.log('TouchMove');
};

TOPPANO.onDocumentTouchEnd = function() {
	console.log('TouchEnd');
};

TOPPANO.onDocumentDragOver = function() {
	console.log('DragOver');
	preventDefaultBrowser(event);
	event.dataTransfer.dropEffect = 'copy';
};

TOPPANO.onDocumentDragEnter = function() {
	console.log('DragEnter');
	document.body.style.opacity = 0.5;
};

TOPPANO.onDocumentDragLeave = function() {
	console.log('DragLeave');
	document.body.style.opacity = 1;
};

TOPPANO.onDocumentDrop = function() {
	console.log('Drop');
	preventDefaultBrowser(event);
};

TOPPANO.onDocumentKeyUp = function(key) {
	console.log('KeyUp');
};

TOPPANO.onWindowResize = function() {
	console.log('Resize');
};
