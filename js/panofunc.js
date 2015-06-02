$(document).ready(function() {
    // Three.js GLOBAL scene objects
    var camera, scene, geometry, material, mesh, renderer;
    
    // some objects on the scene
    var objects = [], 
        showObj = true;

    var defaultMap  = './image/map/sunset.jpg';
    var defaultMap2 = './image/map/4.jpg';

    var camPos = new THREE.Vector3(0, 0, 0),
        isUserInteracting = false,
        lon = 0,  // default: 0
        lat = 0,  // default: 0
        onMouseDownMouseX = 0,
        onMouseDownMouseY = 0,
        onMouseDownLon = 0,
        onMouseDownLat = 0,
        phi = 0,
        theta = 0;

    // setting the constrained FoV
    var fovMax = 100,
        fovMin = 40;

    var littlePlanet = false;

    // initialization
    init();
    animate();

    function init() {
    	// virtual camera canvas (for cropping image)
    	drawCanvas();
    	var canvas = $('#mycanvas');
    	canvas.hide();

    	var flash = $('#flash');
    	flash.hide();

    	var downloadLink = $('#downLink');
    	downloadLink.hide();
        
        var container, mesh;
        container = document.getElementById('container');
        camera = new THREE.PerspectiveCamera(
            70, // Field of View
            window.innerWidth / window.innerHeight, // Aspect Ratio
            1, // Near Plane
            1100 // Far Plane
        );
        // change the positon of the camera
        camera.target = new THREE.Vector3(100, 100, 100);
        scene = new THREE.Scene();
        geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));	// inside-out


        /** Panorama Video
        * DONE: play panorama video
        * TODO: load different video, drop and play
        **/

  //       var video = document.createElement('video');
		// video.width = 640;
		// video.height = 360;
		// video.autoplay = true;
		// video.loop = true;
		// video.src = "./kr.mp4";

		// video.src = "./ntu.mp4";
		// var texture = new THREE.VideoTexture( video );
		// texture.minFilter = THREE.LinearFilter;

		// var material = new THREE.MeshBasicMaterial({
  //           map: texture
  //       });
		// end of video


        // load texture
        var texture = new THREE.ImageUtils.loadTexture(defaultMap);
        texture.minFilter = THREE.LinearFilter;
        material = new THREE.MeshBasicMaterial({map: texture, overdraw: true});

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        addObject();
        
        renderer = Detector.webgl ? new THREE.WebGLRenderer({preserveDrawingBuffer: true})
                                  : new THREE.CanvasRenderer(); // with no WebGL supported
                                  // TODO: canvas renderer snapshot

        renderer.sortObjects = false; // render in the order objects added to the scene
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
        document.addEventListener('mousewheel', onDocumentMouseWheel, false);
        document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
        document.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        }, false);

        document.addEventListener('dragenter', function(event) {
            document.body.style.opacity = 0.5;
        }, false);

        document.addEventListener('dragleave', function(event) {
            document.body.style.opacity = 1;
        }, false);

        document.addEventListener('drop', function(event) {
            event.preventDefault();
            var reader = new FileReader();
            reader.addEventListener('load', function(event) {
                material.map.image.src = event.target.result;
                material.map.needsUpdate = true;
                // console.log(event.target.result);
                
                // video - test
				// video.src = event.target.result;

				// var texture = new THREE.VideoTexture( video );
				// texture.minFilter = THREE.LinearFilter;

				// material = new THREE.MeshBasicMaterial({
		  //           map: texture
		  //       });
		  //       material.map.needsUpdate = true;
		  //       renderer.render(scene, camera);

            }, false);
            // console.log(event.dataTransfer.files[0]);
            reader.readAsDataURL(event.dataTransfer.files[0]);

            document.body.style.opacity = 1;
        }, false);
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('keyup', function(key){
        	if (downloadLink.is(":visible") == true) {
        		if(key.which === 83) {
	        		downloadLink.fadeOut(600);
		        	canvas.fadeOut(600);
		        }
    		}
    		else
                // press 's'
	        	if(key.which === 83) {
	        		saveImage();
	        	}
	        
            // press 'p'
            if (key.which === 80) {
	        	if (showObj) {
	        		objects.forEach(function(item){
	        		item.visible = false;
		        	});
		        	showObj = false;
	        	}
	        	else {
	        		objects.forEach(function(item){
	        		item.visible = true;
		        	});
		        	showObj = true;
	        	}
	        }
	        // if (key.which === 82)
	        // 	littlePlanet = !littlePlanet;
        });

        var snapshot = $('#snapshot');
        if(canvas.is(":visible") == false)
	        snapshot.click(function(event) {
	        	// snapshot.prop('src', '../image/snapshot.png')
	        	var downloadLink = $('#downLink');
	        	if(downloadLink.is(":visible") == false)
		        	saveImage();
	        });
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        var canvas = $('#mycanvas');
        if(canvas.is(":visible") == true)
	        drawCanvas();
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();

        isUserInteracting = true;

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;
    }

    function onDocumentMouseMove(event) {
        if (isUserInteracting === true) {
            lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
            lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
        }

        // check is hover something, and change the color
        if (showObj) {
	        var hit = hitSomething(event);
	        var isHit = hit[0];
	        var hitObject = hit[1];
	        if (isHit) {
	            hitObject.material.color.set('orange');
	        }
	        else
	        	objects.forEach(function(item){
	        		item.material.color.set('white');
	        	});
	    }

    }

    function onDocumentMouseUp(event) {
        isUserInteracting = false;

        // check is hit something, and change the bg
        if (showObj) {
	        var isHit = hitSomething(event)[0];
	        if (isHit) {
                // var geometry2 = new THREE.SphereGeometry(500, 60, 40);
                // geometry2.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));  // inside-out
                // var material2 = new THREE.MeshBasicMaterial({
                //     map: THREE.ImageUtils.loadTexture(defaultMap2)
                // });
                // material2.minFilter = THREE.LinearFilter;

                // var mesh2 = new THREE.Mesh(geometry2, material2);
                // // mesh2.material.opacity = 0.1;
                // scene.add(mesh2);

                for (var i = scene.children.length - 1; i >= 0; i--) {
                    scene.remove(scene.children[i]);
                };

                var texture = new THREE.ImageUtils.loadTexture(defaultMap2);
                texture.minFilter = THREE.LinearFilter;
                material = new THREE.MeshBasicMaterial({map : texture, overdraw: true});
                
                
	            // material.map = THREE.ImageUtils.loadTexture(defaultMap2);
             //    material.minFilter = THREE.LinearFilter;
	            
                delete mesh;
		        mesh = new THREE.Mesh(geometry, material);
                material.transparent = true;
                
                // for(var i = 0 ; i <=10000000 ; i ++) {
                //     material.opacity =  1 - new Date().getTime() * 0.00025;

                // }
                    
                scene.add(mesh);

                for (var i = objects.length - 1; i >= 0; i--) {
                    scene.add(objects[i]);
                };

		        // swap
		        var temp = defaultMap2;
		        defaultMap2 = defaultMap;
		        defaultMap = temp;
	        }
	    }
    }

    function onDocumentMouseWheel(event) {
        if (camera.fov <= fovMax && camera.fov >= fovMin) {
            // WebKit
            if (event.wheelDeltaY) {
                camera.fov -= event.wheelDeltaY * 0.05;

            // Opera / Explorer 9
            } else if (event.wheelDelta) {
                camera.fov -= event.wheelDelta * 0.05;

            // Firefox
            } else if (event.detail) {
                camera.fov += event.detail * 1.0;
            }
        }

        if (camera.fov > fovMax) camera.fov = fovMax;
        if (camera.fov < fovMin) camera.fov = fovMin;

        camera.updateProjectionMatrix();
    }

    function hitSomething(event) {
    	// If hit the objects(and the objects are visible!):
        // ref: http://goo.gl/eQmcX3

    	var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,   //x
                                        -( event.clientY / window.innerHeight ) * 2 + 1,  //y
                                        0.5 );                                            //z
        mouse3D.unproject(camera);  
        mouse3D.sub(camera.position);                
        mouse3D.normalize();
        var raycaster = new THREE.Raycaster(camera.position, mouse3D);
        var intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) 
        	return [true, intersects[0].object];
        else 
        	return [false, null];
    }

    function animate() {
        requestAnimationFrame(animate);
        update();
    }

    function addObject() {
        // add some object
        var geometryObj = new THREE.BoxGeometry(30, 30, 0);
        var materialObj = new THREE.MeshBasicMaterial({ color: 'white', opacity: 0.2});
        materialObj.transparent = true;
        var sphereObj = new THREE.Mesh(geometryObj, materialObj);
        sphereObj.position.set(45,45,45);
        scene.add(sphereObj);
        objects.push(sphereObj);
    }

    function saveImage() {
    	var snapshot = $('#snapshot');
    	var downloadLink = $('#downLink');
    	var capImg;
    	drawCanvas();
    	downloadLink.fadeIn(500)
    	.click(function(event) {
    		// crop resize
    		var fov_now = camera.fov;
    		var theta = THREE.Math.degToRad(camera.fov/2);
    		var img_width = 1 / Math.cos(theta);
    		img_width = img_width * Math.sin(theta) * 0.8;
    		// camera.fov = camera.fov * 0.85;
    		var flash = $('#flash');
    		camera.fov = Math.atan(img_width);
    		camera.fov = camera.fov * 180 / Math.PI * 2;
    		camera.updateProjectionMatrix();
    		// flash.fadeIn(3);
    		objects.forEach(function(item){
        		item.visible = false;
        	});
    		renderer.render(scene, camera);
    		// flash.fadeOut(3);
    		capImg = renderer.domElement.toDataURL('image/jpeg');
    		objects.forEach(function(item){
        		item.visible = true;
        	});
    		camera.fov = fov_now;
    		camera.updateProjectionMatrix();
    		downloadLink.prop("href", capImg)
    		.prop("download", camera.fov + ".jpg")	
    		.fadeOut(600);
    		var canvas = $('#mycanvas');
    		canvas.fadeOut(600);
    	});
    	// window.open(capImg, 'new_window');
    }

    function drawCanvas() {
    	var canvas = $('#mycanvas');
    	canvas.fadeIn(500);
		canvas = document.getElementById('mycanvas');
		canvas.height = window.innerHeight * 0.8;
		canvas.width = window.innerWidth * 0.8;
		var context = canvas.getContext('2d');
		context.beginPath();
		context.rect(0, 0, window.innerWidth*0.8, window.innerHeight*0.8);
		context.lineWidth = 7;
		context.moveTo(window.innerWidth*0.4 - 30, window.innerHeight*0.4);
		context.lineTo(window.innerWidth*0.4 + 30, window.innerHeight*0.4);
		context.lineWidth = 7;
		context.moveTo(window.innerWidth*0.4, window.innerHeight*0.4 - 30);
		context.lineTo(window.innerWidth*0.4, window.innerHeight*0.4 + 30);
		context.lineWidth = 7;
		context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
		context.stroke();
    }

  //   function littlePlanetEffect() {
  //   	if (littlePlanet) {
  //   		camPos.copy(camera.position);
  //   		camera.position.copy( camera.target ).negate();	 fovMax = 300;
  //   		littlePlanet = false;
  //   	}
  //   	else {
		// 	littlePlanet = true;
		// 	camera.position = camPos;
		// 	fovMax = 100;
		// 	if (camera.fov > 100) camera.fov = 100;
  //   	}
		// // Little planet effect
		// // FoV = 160, Lat = -85, Lon = 85, and also set fovMax = 300
		// // position of the camera from center to the circle of the sphere (opposite side of camera target)
		
  //   }

    function update() {
        lat = Math.max(-85, Math.min(85, lat));
        lon = (lon + 360) % 360;
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);

        var camFOV = $('#fov');
		camFOV.text('FoV: ' + Math.round(camera.fov * 100) / 100 
        	+ ' Lat:' + Math.round(lat * 100) / 100 
        	+ ' Lon:' + Math.round(lon * 100) / 100);

		// y: up
        camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
        camera.target.y = 500 * Math.cos(phi);
        camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

        camera.lookAt(camera.target);
		
		// Little planet effect
		// FoV = 160, Lat = -85, Lon = 85, and also set fovMax = 300
		// position of the camera from center to the circle of the sphere (opposite side of camera target)
		// camera.position.copy( camera.target ).negate();	 fovMax = 300;

		// littlePlanetEffect();

        renderer.render(scene, camera);
    }
}); // end of jQuery