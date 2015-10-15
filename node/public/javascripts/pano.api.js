/**
 * Toppano Panorama Viewer API
 * @version 0.8
 * @since 0.8
 */

var TOPPANO = TOPPANO || {};


// TOPPANO Panorama Viewer Initialization
TOPPANO.initMap = function(map) {
	// draw snapshot canvas
	TOPPANO.snapshotCanvasInit();

	// some functions (download link, snapshot...)
	TOPPANO.menuInit();

	// threejs init
	TOPPANO.requestMeta(map.PanoID);

	TOPPANO.threeInit(map);

	// add listener
	TOPPANO.addListener();
	TOPPANO.update();
};

// global variables initialization
TOPPANO.gv = {
	scene: null,
	objScene: null,
	renderer: null,
	stats: null,
	headingOffset: 0,
	transInfo: {},
	// camera parameter
	cam: {
		camera: null,
		lat: 0,
        lng: 0,
		camPos: new THREE.Vector3(0, 0, 0),
        defaultCamFOV: 60,
        phi: 0,
        theta: 0,
        fov: 60
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
		geometry: null,
		texture: null,
		material: null,
		mesh: null,
		panoID: '00000000',
		nextInfo: null
	},

	// scene2 for buffer
	scene2: {
		geometry: null,
		texture: null,
		material: null,
		mesh:1,
		panoID: '00000001'
	},

	// objects in the scene
	objects: {
		transitionObj: [],
		objSphereRadius: 90
	},

	// Const parameters
	para: {
		fov: {
			min: 50,
			max: 85
			// max: 100
		},
		sphereSize: 1000,
		epsilon: 0.1
	},

	// interaction variables
	interact: {
		isUserInteracting: false,
		isAnimate: false,
		onPointerDownPointerX: 0,
		onPointerDownPointerY: 0,
		onPointerDownLon: 0,
		onPointerDownLat: 0,
		timer: null
	},
	urlHash: window.location.hash,
	// tilePath: 'http://helios-api-0.cloudapp.net:6688',
	tilePath: './images/',
	defaultMap: './image/tile/0-0.jpeg'
};



