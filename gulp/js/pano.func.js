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
TOPPANO.threeInit = function(map) {
	TOPPANO.gv.stats = initStats();
	if (map) {
		TOPPANO.initGV(map);
	} else {
		// virtual cam init
		var url = TOPPANO.readURL();
		if (url) {
			TOPPANO.initGV(url);
		}
	}

	TOPPANO.gv.cam.camera = new THREE.PerspectiveCamera(
		TOPPANO.gv.cam.defaultCamFOV, // field of view (vertical)
		// 80,
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near plane
		1100 // far plane
	);
	// change position of the cam
	var sphereSize = TOPPANO.gv.para.sphereSize;
	TOPPANO.gv.cam.camera.target = new THREE.Vector3(sphereSize, sphereSize, sphereSize);

	// scene for bg, objScene for transition objects
	TOPPANO.gv.scene = new THREE.Scene();
	TOPPANO.gv.objScene = new THREE.Scene();

	// renderer setting
	TOPPANO.rendererSetting();

	// load tile images
	var isTrans = false;
	// TOPPANO.gv.scene1.panoID = TOPPANO.gv.transInfo['00000000'].PanoID;
	TOPPANO.loadTiles(isTrans, TOPPANO.gv.scene1.panoID);

	// pre-load
	TOPPANO.preLoadImages();

	// adding icon objects on scene
	TOPPANO.addTransition(TOPPANO.gv.scene1.panoID);

	// TOPPANO.addPlane();
	// console.log(TOPPANO.gv.transInfo['00000001'].transition[0].nextID);
};

// add listeners
TOPPANO.addListener = function() {
	document.addEventListener('mousedown', TOPPANO.onDocumentMouseDown, false);
	document.addEventListener('mousemove', function(event) {
		TOPPANO.onDocumentMouseMove(event);
	}, false);
	document.addEventListener('mouseup', function(event) {
		TOPPANO.onDocumentMouseUp(event);
	}, false);
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

// reading URL info
TOPPANO.readURL = function() {
	var url = TOPPANO.gv.urlHash;
	if (url) {
		var urlSlice = url.slice(1, url.length).split(',');
		// console.log(urlSlice);
		if (urlSlice.length === 4) {
			return {
				zoom: clamp(parseInt(urlSlice[0]), TOPPANO.gv.para.fov.min, TOPPANO.gv.para.fov.max),
				center: {
					lat: parseInt(urlSlice[1]),
					lng: parseInt(urlSlice[2])
				},
				PanoID: urlSlice[3]
			}
		}
	}
};

// setting global variables for initialization
TOPPANO.initGV = function(para) {
	if (para.zoom) {
		TOPPANO.gv.cam.defaultCamFOV = clamp(para.zoom, TOPPANO.gv.para.fov.min, TOPPANO.gv.para.fov.max);
	}
	if (para.center.lat) {
		TOPPANO.gv.cam.lat = para.center.lat;
	}
	if (para.center.lng) {
		TOPPANO.gv.cam.lng = para.center.lng;
	}
	if (para.PanoID) {
		TOPPANO.gv.scene1.panoID = para.PanoID;
	}
};

// loading tiles images
TOPPANO.loadTiles = function(isTrans, ID) {
	var sphereSize = TOPPANO.gv.para.sphereSize;
	THREE.ImageUtils.crossOrigin = '';

	for (var i = 0 ; i < 4 ; i++) {
		for (var j = 0 ; j < 8 ; j++) {
			var geometry = new THREE.SphereGeometry(sphereSize, 4, 8, Math.PI/4 * j, Math.PI/4, Math.PI/4 * i, Math.PI/4);
			if (isTrans) {
				TOPPANO.gv.para.sphereSize -= 1;
				geometry = new THREE.SphereGeometry(TOPPANO.gv.para.sphereSize, 4, 8, Math.PI/4 * j - TOPPANO.gv.headingOffset * Math.PI / 180, Math.PI/4, Math.PI/4 * i, Math.PI/4);
			}
			geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

			// var imagePath = TOPPANO.gv.tilePath + '/photo?panoid=' + ID + '&output=tile&x=' + i + '&y=' + j ,
			var imagePath = TOPPANO.gv.tilePath + ID +'/' + i + '-' + j + '.jpeg',
			texture = THREE.ImageUtils.loadTexture(imagePath);
			texture.minFilter = THREE.LinearFilter;

			var material = new THREE.MeshBasicMaterial({
				map: texture,
				overdraw: true,
				transparent: true
			});
			if (isTrans) {
				material.opacity = 0;
			}
			var mesh = new THREE.Mesh(geometry, material);
			TOPPANO.gv.scene.add(mesh);
		}
	}
	if (isTrans) {
		sleep(500);
	}
	// console.log(TOPPANO.gv.scene.children.length);  // 32
};

// transfer to another scene
TOPPANO.changeScene = function(nextInfo) {
	var nowHeading = TOPPANO.gv.transInfo.heading;
	TOPPANO.requestMeta(nextInfo.name.nextID);
	var rotateDegree = TOPPANO.gv.transInfo.heading - nowHeading;
	TOPPANO.gv.headingOffset += rotateDegree;

	TOPPANO.gv.scene1.nextInfo = nextInfo.name;

	for (var i = TOPPANO.gv.objScene.children.length - 1 ; i >= 0 ; i--) {
		TOPPANO.gv.objScene.remove(TOPPANO.gv.objScene.children[i]);
	}

	TOPPANO.loadTiles(true, nextInfo.name.nextID);
	TOPPANO.gv.interact.isAnimate = true;
};

// pre-load all scene images
TOPPANO.preLoadImages = function() {
	// console.log('Pre-loading...');
	// ref: threejs LoadingManager
};

// add all transition objects
TOPPANO.addTransition = function(panoID) {
	var transLength = TOPPANO.gv.transInfo.transition.length;
	for (var i = 0 ; i < transLength ; i++) {
		var objLatLng = new TOPPANO.LatLng(TOPPANO.gv.transInfo.transition[i].lat, TOPPANO.gv.transInfo.transition[i].lng);
		var rotationInfo = {
			X: TOPPANO.gv.transInfo.transition[i].rotateX * Math.PI / 180,
			Y: TOPPANO.gv.transInfo.transition[i].rotateY * Math.PI / 180,
			Z: TOPPANO.gv.transInfo.transition[i].rotateZ * Math.PI / 180
		};
		TOPPANO.addObject(objLatLng, rotationInfo, TOPPANO.gv.transInfo.transition[i].size, i);
	}
};

// add an objects
TOPPANO.addObject = function(LatLng, rotation, size, transID) {
	// console.log('Add transition objects here.');
	var radiusObj = TOPPANO.gv.transInfo.transition[transID].objSphereRadius,
	phiObj = THREE.Math.degToRad(90 - LatLng.lat),
	thetaObj = THREE.Math.degToRad(LatLng.lng - TOPPANO.gv.headingOffset);

	var geometryObj = new THREE.PlaneBufferGeometry(size, size, 32),
	materialObj = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('./images/arrow1.png'),
		side: THREE.DoubleSide,
		opacity: 0.5,
		transparent: true
	}),
	transitionObj = new THREE.Mesh(geometryObj, materialObj);

	var xObj = radiusObj * Math.sin(phiObj) * Math.cos(thetaObj),
    yObj = radiusObj * Math.cos(phiObj),
    zObj = radiusObj * Math.sin(phiObj) * Math.sin(thetaObj);

    transitionObj.position.set(xObj, yObj, zObj);

    var headingOffsetRad = TOPPANO.gv.headingOffset * Math.PI / 180;

    // rotate xyz axis on world coordinate
    var q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotation.X);
	transitionObj.quaternion.multiplyQuaternions(q, transitionObj.quaternion);
	// rotateY must add the offset
	q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation.Y + headingOffsetRad);
	transitionObj.quaternion.multiplyQuaternions(q, transitionObj.quaternion);
	q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rotation.Z);
	transitionObj.quaternion.multiplyQuaternions(q, transitionObj.quaternion);

    transitionObj.name = {
    	nextID: TOPPANO.gv.transInfo.transition[transID].nextID
    };
    TOPPANO.gv.objScene.add(transitionObj);
    TOPPANO.gv.objects.transitionObj.push(transitionObj);
};

// add a random object for test!
TOPPANO.addRandObj = function(x, y, z, size) {
	var geometryObj = new THREE.PlaneBufferGeometry(size, size, 32),
	materialObj = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('./images/pin.png'),
		side: THREE.DoubleSide,
		opacity: 0.5,
		transparent: true
	}),
	transitionObj = new THREE.Mesh(geometryObj, materialObj);

    transitionObj.position.set(x, y ,z);
    transitionObj.lookAt(TOPPANO.gv.cam.camera.position);
    TOPPANO.gv.objScene.add(transitionObj);

    var ObjLatLng = xyz2LatLng(x, y, z, TOPPANO.gv.objects.objSphereRadius);
};

// add a random object for test!
TOPPANO.addRandObj2 = function(LatLng, size) {
	var radiusObj = TOPPANO.gv.objects.objSphereRadius,
	phiObj = THREE.Math.degToRad(90 - LatLng.lat),
	thetaObj = THREE.Math.degToRad(LatLng.lng);

	var geometryObj = new THREE.PlaneBufferGeometry(size, size, 32),
	materialObj = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('./images/pin.png'),
		side: THREE.DoubleSide,
		opacity: 0.5,
		transparent: true
	}),
	transitionObj = new THREE.Mesh(geometryObj, materialObj);

	var xObj = radiusObj * Math.sin(phiObj) * Math.cos(thetaObj),
    yObj = radiusObj * Math.cos(phiObj),
    zObj = radiusObj * Math.sin(phiObj) * Math.sin(thetaObj);

    transitionObj.position.set(xObj, yObj ,zObj);
    transitionObj.lookAt(TOPPANO.gv.cam.camera.position);
    TOPPANO.gv.objScene.add(transitionObj);
};

// add plane for testing GLSL
TOPPANO.addPlane = function() {
	// console.log('Add transition objects here.');
	var radiusObj = TOPPANO.gv.objects.objSphereRadius,
	phiObj = THREE.Math.degToRad(90),
	thetaObj = THREE.Math.degToRad(0);

	   var uniforms = {
      "color1" : {
        type : "c",
        value : new THREE.Color(0xffffff)
      },
      "color2" : {
        type : "c",
        value : new THREE.Color(0x7CC5D7)
      },
      "radius1" : {
        type : "f",
        value : 0.3,
        min : 0, // only used for dat.gui, not needed for production
        max : 1 // only used for dat.gui, not needed for production
      },
      "radius2" : {
        type : "f",
        value : 0.32,
        min : 0, // only used for dat.gui, not needed for production
        max : 1 // only used for dat.gui, not needed for production
      },
      "amount" : {
        type : "f",
        value : 80,
        min : 1, // only used for dat.gui, not needed for production
        max : 100 // only used for dat.gui, not needed for production
      },
    }
    var vertexShader = document.getElementById('vertexShader').text;
    var fragmentShader = document.getElementById('fragmentShader').text;

    var materialObj = new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : vertexShader,
		fragmentShader : fragmentShader
    });

	var geometryObj = new THREE.PlaneBufferGeometry(200, 140, 32),
	// materialObj = new THREE.MeshBasicMaterial({
	// 	color: 0x000000,
	// 	side: THREE.DoubleSide,
	// 	opacity: 0.7,
	// 	transparent: true
	// }),
	transitionObj = new THREE.Mesh(geometryObj, materialObj);

	var xObj = radiusObj * Math.sin(phiObj) * Math.cos(thetaObj),
    yObj = radiusObj * Math.cos(phiObj),
    zObj = radiusObj * Math.sin(phiObj) * Math.sin(thetaObj);
    transitionObj.position.set(xObj, yObj, zObj);
    transitionObj.lookAt(TOPPANO.gv.cam.camera.position);
    TOPPANO.gv.objScene.add(transitionObj);
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
	TOPPANO.gv.renderer.autoClear = false;
	TOPPANO.gv.renderer.setPixelRatio(window.devicePixelRatio);
	TOPPANO.gv.renderer.setSize(window.innerWidth, window.innerHeight);

	var container = document.getElementById('container');
	container.appendChild(TOPPANO.gv.renderer.domElement);
};

// if hit the objects(and the objects are visible), return: (isHit, hitObj)
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

// if hit the objects(and the objects are visible), return: (isHit, hitObj)
TOPPANO.hitSphere = function(event) {
	// event.clientY
    var mouse2D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, //x
        -(event.clientY / window.innerHeight) * 2 + 1); // y

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse2D, TOPPANO.gv.cam.camera);
    var intersects = raycaster.intersectObjects(TOPPANO.gv.scene.children);
    // console.log(intersects[0].point);
    return intersects[0].point;
};

// change the mesh color which is hit by user
TOPPANO.hitWhichSphere = function(event) {
    var mouse2D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, //x
        -(event.clientY / window.innerHeight) * 2 + 1); // y

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse2D, TOPPANO.gv.cam.camera);
    var intersects = raycaster.intersectObjects(TOPPANO.gv.scene.children);
    intersects[0].object.material.color.set( 0xff0000 ); // change to red
    // console.log(intersects[0].object.position);
};

// snapshot function
TOPPANO.saveImage = function() {
	var fov_now = TOPPANO.gv.cam.camera.fov,
	theta = THREE.Math.degToRad(fov_now / 2),
	img_width = 0.8 * Math.tan(theta);

	TOPPANO.gv.cam.camera.fov = Math.atan(img_width) * 180 / Math.PI * 2;
	TOPPANO.gv.cam.camera.updateProjectionMatrix();
	TOPPANO.gv.renderer.render(TOPPANO.gv.scene, TOPPANO.gv.cam.camera);

	// TODO: download link
	var cap_img = TOPPANO.gv.renderer.domElement.toDataURL('images/jpeg'),
	new_win = window.open(cap_img, '_blank');
	TOPPANO.gv.cam.camera.fov = fov_now;
	TOPPANO.gv.cam.camera.updateProjectionMatrix();
};

// update the URL query
TOPPANO.updateURL = function() {
    window.location.hash = TOPPANO.gv.cam.camera.fov + ',' + TOPPANO.gv.cam.lat + ',' +
    (TOPPANO.gv.cam.lng + TOPPANO.gv.headingOffset) + ',' + TOPPANO.gv.scene1.panoID;
};

// request for metadata
TOPPANO.requestMeta = function(ID) {
	var xhr = new XMLHttpRequest();
    xhr.open('PUT', 'hi', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var userInfo = JSON.parse(xhr.responseText);
            TOPPANO.gv.transInfo = userInfo;
        }
    };
    xhr.send(JSON.stringify({
        PanoID: ID
    }));
};

// render scene
TOPPANO.renderScene = function() {
	if (TOPPANO.gv.interact.isAnimate) {
		var fadeInSpeed = 0.02;

		// if second scene fully shows up
		if (TOPPANO.gv.scene.children[60].material.opacity >= 1) {
			TOPPANO.gv.interact.isAnimate = false;
			for (var i = 31 ; i >= 0 ; i--) {
				TOPPANO.gv.scene.remove(TOPPANO.gv.scene.children[i]);
			}
			var nextID = TOPPANO.gv.scene1.nextInfo.nextID;
			TOPPANO.gv.scene1.panoID = nextID;
			TOPPANO.gv.objects.transitionObj = [];
			TOPPANO.addTransition(nextID);
			TOPPANO.updateURL();
			requestAnimationFrame(TOPPANO.update);
			return 0;
		}

		// fade in animation
		for (var i = 63 ; i >= 32 ; i--) {
			TOPPANO.gv.scene.children[i].material.opacity += fadeInSpeed;
		}
		requestAnimationFrame(TOPPANO.renderScene);
		TOPPANO.gv.renderer.clear();
        TOPPANO.gv.renderer.render(TOPPANO.gv.scene, TOPPANO.gv.cam.camera);
        TOPPANO.gv.renderer.clearDepth();
        TOPPANO.gv.renderer.render(TOPPANO.gv.objScene, TOPPANO.gv.cam.camera);
    } else {
        requestAnimationFrame(TOPPANO.update);
        TOPPANO.gv.renderer.clear();
        TOPPANO.gv.renderer.render(TOPPANO.gv.scene, TOPPANO.gv.cam.camera);
        TOPPANO.gv.renderer.clearDepth();
        TOPPANO.gv.renderer.render(TOPPANO.gv.objScene, TOPPANO.gv.cam.camera);
    }
};

// threejs update
TOPPANO.update = function() {
    TOPPANO.gv.cam.lat = Math.max(-85, Math.min(85, TOPPANO.gv.cam.lat));
    TOPPANO.gv.cam.lng = (TOPPANO.gv.cam.lng + 360) % 360;
    TOPPANO.gv.cam.phi = THREE.Math.degToRad(90 - TOPPANO.gv.cam.lat);
    TOPPANO.gv.cam.theta = THREE.Math.degToRad(TOPPANO.gv.cam.lng);

    // console.log('FoV: ' + Math.round(TOPPANO.gv.cam.camera.fov * 100) / 100 +
    //     ' Lat:' + Math.round(TOPPANO.gv.cam.lat * 100) / 100 +
    //     ' Lon:' + Math.round(TOPPANO.gv.cam.lng * 100) / 100);

    // y: up
    TOPPANO.gv.cam.camera.target.x = Math.sin(TOPPANO.gv.cam.phi) * Math.cos(TOPPANO.gv.cam.theta);
    TOPPANO.gv.cam.camera.target.y = Math.cos(TOPPANO.gv.cam.phi);
    TOPPANO.gv.cam.camera.target.z = Math.sin(TOPPANO.gv.cam.phi) * Math.sin(TOPPANO.gv.cam.theta);
    TOPPANO.gv.cam.camera.lookAt(TOPPANO.gv.cam.camera.target);

    TOPPANO.gv.stats.update();
    TOPPANO.renderScene();
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

// js performance monitor
function initStats() {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    return stats;
}

// return: phi(lat:the angle between x-z plane, have to subtract 90) and theta(lng)
function xyz2LatLng(x, y ,z) {
	// y: up, phi: the angle between y axis, theta: the angle between x asix on x-z plane
	var r = Math.sqrt(x*x + y*y + z*z),
	theta = Math.atan(z / x),
	phi = Math.acos(y / r);
	var cosTheta = x / r / Math.sin(phi);
	if (cosTheta < 0)
		theta += Math.PI;
	var thetaDegree = theta * 180 / Math.PI,
	phiDegree = phi * 180 / Math.PI

	var objLatLng = new TOPPANO.LatLng(90 - phiDegree, thetaDegree);
	return objLatLng;
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
    return Math.min(Math.max(number, min), max);
}