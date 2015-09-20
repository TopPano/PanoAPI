/**
 * Toppano Panorama Viewer API
 * Panorama Function
 */

// snapshot canvas drawing initialization
TOPPANO.snapshotCanvasInit = function() {
	TOPPANO.drawCanvas();
	var canvas = document.getElementById('myCanvas');
	hide(canvas);
};

// main menu initialization
TOPPANO.menuInit = function() {
	var downloadLink = document.getElementById('downLink');
	hide(downloadLink);

	var snapshot = document.getElementById('snapshot');
	var canvas = document.getElementById('myCanvas');
	// TODO: saveImage trigger function by js click event
};

// threejs initialization
TOPPANO.threeInit = function() {
	// virtual cam init
	TOPPANO.gv.cam.camera = new THREE.PerspectiveCamera(
		TOPPANO.gv.cam.defaultCamFOV, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near plane
		1100 // far plane
	);

	// change position of the cam
	var sphereSize = TOPPANO.gv.para.sphereSize;
	TOPPANO.gv.cam.camera.target = new THREE.Vector3(sphereSize, sphereSize, sphereSize);
	TOPPANO.gv.scene = new THREE.Scene();

	// pre-load
	TOPPANO.preLoadImages();

	TOPPANO.gv.scene1.geometry = new THREE.SphereGeometry(sphereSize, 60, 60);
	TOPPANO.gv.scene1.geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1)); // inside-out
	// scene2 for changing scene
	TOPPANO.gv.scene2.geometry = new THREE.SphereGeometry(sphereSize, 60, 60);
	TOPPANO.gv.scene2.geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1)); // inside-out

	// loading texture
	TOPPANO.gv.scene1.texture = new THREE.ImageUtils.loadTexture(TOPPANO.gv.defaultMap);
	TOPPANO.gv.scene1.texture.minFilter = THREE.LinearFilter;
	TOPPANO.gv.scene1.material = new THREE.MeshBasicMaterial({
		map: TOPPANO.gv.scene1.texture,
		overdraw: true
	});
	TOPPANO.gv.scene1.mesh = new THREE.Mesh(TOPPANO.gv.scene1.geometry, TOPPANO.gv.scene1.material);
	TOPPANO.gv.scene.add(TOPPANO.gv.scene1.mesh);

	// adding icon objects on scene
	TOPPANO.addTransition();

	// renderer setting
	TOPPANO.rendererSetting();
};

// add listeners
TOPPANO.addListener = function() {
	document.addEventListener('mousedown', TOPPANO.onDocumentMouseDown, false);
	document.addEventListener('mousemove', TOPPANO.onDocumentMouseMove, false);
	document.addEventListener('mouseup', TOPPANO.onDocumentMouseUp, false);
	document.addEventListener('mousewheel', function(event) {
		TOPPANO.onDocumentMouseWheel(event);
	}, false);
	document.addEventListener('touchstart', TOPPANO.onDocumentTouchStart, false);
	document.addEventListener('touchmove', TOPPANO.onDocumentTouchMove, false);
	document.addEventListener('touchend', TOPPANO.onDocumentTouchEnd, false);
	document.addEventListener('DOMMouseScroll', function(event) {
		TOPPANO.onDocumentMouseWheel(event);
	}, false);
	document.addEventListener('dragover', function(event) {
		TOPPANO.onDocumentDragOver(event);
	}, false);
	document.addEventListener('dragenter', TOPPANO.onDocumentDragEnter, false);
	document.addEventListener('dragleave', TOPPANO.onDocumentDragLeave, false);
	document.addEventListener('drop', function(event) {
		TOPPANO.onDocumentDrop(event);
	}, false);
	document.addEventListener('keyup', function(key) {
		TOPPANO.onDocumentKeyUp(key);
	}, false);
	window.addEventListener('resize', TOPPANO.onWindowResize, false);
};

// pre-load all scene images
TOPPANO.preLoadImages = function() {
	console.log('Pre-loading...');
	// ref: threejs LoadingManager
};

// add transition objects
TOPPANO.addTransition = function() {
	console.log('Add transition objects here.');
};

// renderer setting
TOPPANO.rendererSetting = function() {
	// WebGLRenderer for better quality if having webgl
	var webglRendererPara = {
		preserveDrawingBuffer: true,
		autoClearColor: false
	};
	TOPPANO.gv.renderer = Detector.webgl ? new THREE.WebGLRenderer(webglRendererPara)
							: new THREE.CanvasRenderer(); // with no WebGL supported
	TOPPANO.gv.renderer.sortObjects = false;
	TOPPANO.gv.renderer.setPixelRatio(window.devicePixelRation);
	TOPPANO.gv.renderer.setSize(window.innerWidth, window.innerHeight);

	var container = document.getElementById('container');
	container.appendChild(TOPPANO.gv.renderer.domElement);
};

// if hit the objects(and the objects are visible)
TOPPANO.hitSomething = function(event) {

    var mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, //x
        -(event.clientY / window.innerHeight) * 2 + 1, //y
        0.5); // z

    mouse3D.unproject(TOPPANO.gv.cam.camera);
    mouse3D.sub(TOPPANO.gv.cam.camera.position);
    mouse3D.normalize();
    var raycaster = new THREE.Raycaster(TOPPANO.gv.cam.camera.position, mouse3D);
    var intersects = raycaster.intersectObjects(TOPPANO.gv.objects.transitionObj);
    if (intersects.length > 0) {
        // return which object is hit
        for (var i = 0; i < TOPPANO.gv.objects.transitionObj.length; i++) {
            if (intersects[0].object.position.distanceTo(TOPPANO.gv.objects.transitionObj[i].position) < 10) {
                return [true, TOPPANO.gv.objects.transitionObj[i]];
            }
        }
    } else
        return [false, null];
};

// snapshot function
TOPPANO.saveImage = function() {

};

// update the URL query
TOPPANO.updateURL = function() {
    window.location.hash = TOPPANO.gv.cam.fov + ',' + TOPPANO.gv.cam.lat + ',' +
    TOPPANO.gv.cam.lon + ',' + TOPPANO.gv.scene1.panoID;
};

// print out ERROR messages
TOPPANO.printError = function (errorMsg) {
	console.log('Error: ' + errorMsg);
};

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