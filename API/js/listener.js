/**
 * Toppano Panorama Viewer API
 * Listener Function
 */

TOPPANO.onDocumentMouseDown = function() {
	console.log('MouseDown');

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

	TOPPANO.gv.interact.isUserInteracting = false;

	// check if hit something, and change the sphere
	TOPPANO.updateURL();
};

TOPPANO.onDocumentMouseWheel = function(event) {
	console.log('MouseWheel');

	preventDefaultBrowser(event);

	// check FoV range
	if (TOPPANO.gv.cam.fov <= TOPPANO.gv.para.fov.max
		&& TOPPANO.gv.cam.fov >= TOPPANO.gv.para.fov.min) {
        // WebKit (Safari / Chrome)
        if (event.wheelDeltaY) {
            TOPPANO.gv.cam.fov -= event.wheelDeltaY * 0.05;
        }
        // Opera / IE 9
        else if (event.wheelDelta) {
            TOPPANO.gv.cam.fov -= event.wheelDelta * 0.05;
        }
        // Firefox
        else if (event.detail) {
            TOPPANO.gv.cam.fov += event.detail * 1.0;
        }
    }

    if (TOPPANO.gv.cam.fov > TOPPANO.gv.para.fov.max) {
    	TOPPANO.gv.cam.fov = TOPPANO.gv.para.fov.max;
    }
    if (TOPPANO.gv.cam.fov < TOPPANO.gv.para.fov.min) {
    	TOPPANO.gv.cam.fov = TOPPANO.gv.para.fov.min;
    }

    TOPPANO.gv.cam.camera.updateProjectionMatrix();

    // update URL after scroll stops for 0.1 second
    if (TOPPANO.gv.interact.timer !== null) {
        clearTimeout(TOPPANO.gv.interact.timer);
    }
    TOPPANO.gv.interact.timer = setTimeout(function() {
        TOPPANO.updateURL();
    }, 100);
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

TOPPANO.onDocumentDragOver = function(event) {
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

TOPPANO.onDocumentDrop = function(event) {
	console.log('Drop');
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
	console.log('KeyUp');

	var downloadLink = document.getElementById('downLink');
	var canvas = document.getElementById('myCanvas');

	if (downloadLink.style.opacity > 0) {
        if (key.which === 83) {
        	fadeOut(downloadLink, 600);
        	fadeOut(canvas, 600);
        }
    } else
    // press 's': snapshot function
    if (key.which === 83) {
    	fadeIn(downloadLink, 600);
    	fadeIn(canvas, 600);
        TOPPANO.saveImage();
    }

    // press 'p': show transition icons
    if (key.which === 80) {
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
	console.log('Resize');

	TOPPANO.gv.cam.camera.aspect = window.innerWidth / window.innerHeight;
    TOPPANO.gv.cam.camera.updateProjectionMatrix();
    TOPPANO.gv.renderer.setSize(window.innerWidth, window.innerHeight);
    var canvas = document.getElementById('myCanvas');
    if (canvas.style.opacity > 0)
        TOPPANO.drawCanvas();
};
