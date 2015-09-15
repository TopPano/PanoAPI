/**
 * Toppano Panorama Viewer API
 * @version 0.8
 * @since 0.8
 */

var TOPPANO = TOPPANO || {};

// global variables initialization
TOPPANO.gv = {
	// camera parameter
	cam: {
		lat: 0,
        lon: 0,
		camPos: new THREE.Vector3(0, 0, 0),
        isUserInteracting: false,
        defaultCamFOV: 75,
        phi: 0,
        theta: 0,
        fov: 75
	},

	// interative controls
	control: {
		onMouseDownMouseX: 0,
        onMouseDownMouseY: 0,
        onMouseDownLon: 0,
        onMouseDownLat: 0
	},

	// scene1 for showing to users
	scene1: {
		camera:1,
		scene:1,
		geometry:1,
		material:1,
		mesh:1,
		renderer:1,
		panoID: 1
	},

	// scene2 for buffer
	scene2: {
		geometry:1,
		texture:1,
		mesh:1,
		panoID: 2
	},

	// Const parameters
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

// TOPPANO Panorama Viewer Initialization
TOPPANO.init = function() {
	// draw cavas
	// some functions (download link, snapshot...)

	// threejs init

	// change position of the cam

	// pre-load

	// loading texture

	// adding icon objects on scene

	// renderer setting

	// add listener
};

TOPPANO.printError = function (errorMsg) {
	console.log('Error: ' + errorMsg);
};

