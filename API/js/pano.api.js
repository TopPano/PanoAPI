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
		renderer:1,
		camPos: new THREE.Vector3(0, 0, 0)
	},
	scene2: {
		geometry:1,
		texture:1,
		mesh:1
	},
	para: {
		fov: {
			min: 60,
			max: 100
		},
		sphereSize: 100,
		epsilon: 0.1
	},
	urlHash: window.location.hash
};



TOPPANO.printError = function (errorMsg) {
	console.log('Error: ' + errorMsg + "  " + TOPPANO.gv.scene1.camera);
	console.log(TOPPANO.gv);
};

