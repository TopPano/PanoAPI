/**
 * Toppano Panorama Viewer API
 * Listener Function
 */

// check whether in the container
TOPPANO.checkMouseInContainer = function() {

    var mouseX = event.clientX,
        mouseY = event.clientY;
    console.log(mouseX, TOPPANO.gv.container.bound.left, TOPPANO.gv.container.bound.right);
    console.log(mouseY, TOPPANO.gv.container.bound.top, TOPPANO.gv.container.bound.bottom);
    // TOPPANO.gv.container.bound
    return between(mouseX, TOPPANO.gv.container.bound.left, TOPPANO.gv.container.bound.right)
    && between(mouseY, TOPPANO.gv.container.bound.top, TOPPANO.gv.container.bound.bottom);
};


TOPPANO.onDocumentMouseDown = function() {
	// console.log('MouseDown');
    console.log(TOPPANO.checkMouseInContainer());
	TOPPANO.gv.interact.isUserInteracting = true;

	TOPPANO.gv.interact.onPointerDownPointerX = event.clientX;
	TOPPANO.gv.interact.onPointerDownPointerY = event.clientY;

	TOPPANO.gv.interact.onPointerDownLon = TOPPANO.gv.cam.lng;
	TOPPANO.gv.interact.onPointerDownLat = TOPPANO.gv.cam.lat;
};

TOPPANO.onDocumentMouseMove = function(event) {
	// console.log('MouseMove');

	if (TOPPANO.gv.interact.isUserInteracting) {
		var deltaX = TOPPANO.gv.interact.onPointerDownPointerX - event.clientX,
		deltaY = event.clientY - TOPPANO.gv.interact.onPointerDownPointerY;

		TOPPANO.gv.cam.lng = deltaX * 0.1 + TOPPANO.gv.interact.onPointerDownLon;
		TOPPANO.gv.cam.lat = deltaY * 0.1 + TOPPANO.gv.interact.onPointerDownLat;
	}

	// check if hover something, change the icon color
    var hit = TOPPANO.hitSomething(event),
    isHit = hit[0],
    hitObj = hit[1];
    if (isHit) {
        hitObj.material.color.set('orange');
    } else {
        TOPPANO.gv.objects.transitionObj.forEach(function(item) {
            item.material.color.set('white');
        });
    }
};

TOPPANO.onDocumentMouseUp = function(event) {
	TOPPANO.gv.interact.isUserInteracting = false;

    var hit = TOPPANO.hitSomething(event),
    isHit = hit[0],
    hitObj = hit[1];
    if (isHit) {
        TOPPANO.gv.scene1.nextInfo = hit[1].name;
        TOPPANO.changeScene(hitObj);
    }

    // add objects if user wants
    var hitPos = TOPPANO.hitSphere(event);
    var ObjLatLng = xyz2LatLng(hitPos.x, hitPos.y, hitPos.z);
    // console.log(ObjLatLng.lat, ObjLatLng.lng);
    // TOPPANO.addRandObj2(ObjLatLng, 10);
    // TOPPANO.addRandObj(hitPos.x, hitPos.y, hitPos.z, 10);

	// check if hit something, and change the sphere
	TOPPANO.updateURL();
};

TOPPANO.onDocumentMouseWheel = function(event) {
	// check FoV range
	if (TOPPANO.gv.cam.camera.fov <= TOPPANO.gv.para.fov.max
		&& TOPPANO.gv.cam.camera.fov >= TOPPANO.gv.para.fov.min) {
        // WebKit (Safari / Chrome)
        if (event.wheelDeltaY) {
            TOPPANO.gv.cam.camera.fov -= event.wheelDeltaY * 0.05;
        }
        // Opera / IE 9
        else if (event.wheelDelta) {
            TOPPANO.gv.cam.camera.fov -= event.wheelDelta * 0.05;
        }
        // Firefox
        else if (event.detail) {
            TOPPANO.gv.cam.camera.fov += event.detail * 1.0;
        }
    }

    if (TOPPANO.gv.cam.camera.fov > TOPPANO.gv.para.fov.max) {
    	TOPPANO.gv.cam.camera.fov = TOPPANO.gv.para.fov.max;
    }
    if (TOPPANO.gv.cam.camera.fov < TOPPANO.gv.para.fov.min) {
    	TOPPANO.gv.cam.camera.fov = TOPPANO.gv.para.fov.min;
    }

    // var cameraFov = TOPPANO.gv.cam.camera.fov,
    // cameraAspect = TOPPANO.gv.cam.camera.aspect;
    // var hFOV = 2 * Math.atan( Math.tan( cameraFov * Math.PI / 180 / 2 ) * cameraAspect ) * 180 / Math.PI; // degrees
    // console.log(hFOV);

    TOPPANO.gv.cam.camera.updateProjectionMatrix();

    // update URL after scroll stops for 0.1 second
    if (TOPPANO.gv.interact.timer !== null) {
        clearTimeout(TOPPANO.gv.interact.timer);
    }
    TOPPANO.gv.interact.timer = setTimeout(function() {
        TOPPANO.updateURL();
    }, 50);
};

TOPPANO.onDocumentTouchStart = function() {
	// console.log('TouchStart');
};

TOPPANO.onDocumentTouchMove = function() {
	// console.log('TouchMove');
};

TOPPANO.onDocumentTouchEnd = function() {
	// console.log('TouchEnd');
};

TOPPANO.onDocumentDragOver = function(event) {
	preventDefaultBrowser(event);
	event.dataTransfer.dropEffect = 'copy';
};

TOPPANO.onDocumentDragEnter = function() {
	document.body.style.opacity = 0.5;
};

TOPPANO.onDocumentDragLeave = function() {
	document.body.style.opacity = 1;
};

TOPPANO.onDocumentDrop = function(event) {
	preventDefaultBrowser(event);

	var reader = new FileReader();
    reader.addEventListener('load', function(event) {
        var fileType = event.target.result.slice(5, 10);

        if (fileType === 'image') {
            TOPPANO.gv.scene1.material.map.image.src = event.target.result;
            TOPPANO.gv.scene1.material.map.needsUpdate = true;
        }
        // filetype === 'video'
    }, false);
    reader.readAsDataURL(event.dataTransfer.files[0]);
    document.body.style.opacity = 1;
};

TOPPANO.onDocumentKeyUp = function(key) {
	// var downloadLink = document.getElementById('downLink');
	var canvas = document.getElementById('myCanvas');

	if (canvas.style.opacity > 0) {
        // press 's': snapshot function
        if (key.which === 83) {
        	// fadeOut(downloadLink, 600);
        	fadeOut(canvas, 600);
        }
    } else
    // press 's': snapshot function
    if (key.which === 83) {
    	// fadeIn(downloadLink, 600);
    	fadeIn(canvas, 600);
    } else
    // press 'r': snapshot function
    if (key.which === 82) {
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', 'http://127.0.0.1:1337/hi');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                var userInfo = JSON.parse(xhr.responseText);
                TOPPANO.gv.transInfo = userInfo;
                // console.log(userInfo);
                console.log(TOPPANO.gv.transInfo.PanoID);
            }
        };
        xhr.send(JSON.stringify({
            PanoID: TOPPANO.gv.scene1.panoID
        }));
    } else

    // press 'p': snapshot save image
    if (key.which === 80) {
        TOPPANO.saveImage();
        // if (showObj) {
        //     objects.forEach(function(item) {
        //         item.visible = false;
        //     });
        //     showObj = false;
        // } else {
        //     objects.forEach(function(item) {
        //         item.visible = true;
        //     });
        //     showObj = true;
        // }
    }
};

TOPPANO.onWindowResize = function() {
    if (TOPPANO.gv.isFullScreen) {
        TOPPANO.gv.cam.camera.aspect = window.innerWidth / window.innerHeight;
        TOPPANO.gv.cam.camera.updateProjectionMatrix();
        TOPPANO.gv.renderer.setSize(window.innerWidth, window.innerHeight);
        var canvas = document.getElementById('myCanvas');
        if (canvas.style.opacity > 0) {
            TOPPANO.drawCanvas();
        }
    }
};
