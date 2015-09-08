/**
 * Toppano Panorama Viewer API
 * @version 0.8
 * @since 0.8
 */

var TOPPANO = TOPPANO || {};

// global variables initialization
TOPPANO.gv = {
	scene1: {
		camera:1,
		scene:1,
		geometry:1,
		material:1,
		mesh:1,
		renderer1:1
	},
	scene2: {
		geometry:1,
		texture:1,
		mesh:1
	}
};


TOPPANO.printError = function (errorMsg) {
	console.log('Error: ' + errorMsg + "  " + TOPPANO.gv.scene1.camera);
	console.log(TOPPANO.gv);
};

