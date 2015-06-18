$(document).ready(function() {
    // Three.js GLOBAL scene objects
    var camera, scene, geometry, material, mesh, renderer;
    var geometry2, texture2, mesh2;

    // which sphere now
    var nowSphereID = 9,
        nowSphere = flyInfo.sphere[nowSphereID];

    // some objects on the scene
    var objects = [],
        showObj = true;

    var defaultMap = './image/fly/' + nowSphereID + '.jpg';

    var camPos = new THREE.Vector3(0, 0, 0),
        isUserInteracting = false,
        lon = 0, // default: 0
        lat = 0, // default: 0
        onMouseDownMouseX = 0,
        onMouseDownMouseY = 0,
        onMouseDownLon = 0,
        onMouseDownLat = 0,
        phi = 0,
        theta = 0;

    // setting the constrained FoV
    var fovMax = 100,
        fovMin = 45;
    var sphereSize = 100;
    var littlePlanet = false;

    // if changing the scene, need some transition effects
    var isAnimate = false;

    // initialization
    var stats = initStats();
    init();
    update();

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

        camera.target = new THREE.Vector3(sphereSize, sphereSize, sphereSize);
        scene = new THREE.Scene();
        geometry = new THREE.SphereGeometry(sphereSize, 60, 40);
        geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1)); // inside-out

        // for changing scene
        geometry2 = new THREE.SphereGeometry(sphereSize, 60, 40);
        geometry2.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));


        // /** Panorama Video
        //  * DONE: play panorama video
        //  * TODO: load different video, drop and play
        //  **/

        // var video = document.createElement('video');
        // // video.width = 640;
        // // video.height = 360;
        // video.autoplay = true;
        // video.loop = true;
        // video.src = "./image/map/kr.mp4";

        // // video.src = "./ntu.mp4";
        // var texture = new THREE.VideoTexture(video);
        // texture.minFilter = THREE.LinearFilter;

        // // end of video

        // load texture
        texture = new THREE.ImageUtils.loadTexture(defaultMap);
        texture.minFilter = THREE.LinearFilter;
        material = new THREE.MeshBasicMaterial({
            map: texture,
            overdraw: true
        });


        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        addObject();


        renderer = Detector.webgl ? new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            autoClearColor: false
        }) : new THREE.CanvasRenderer(); // with no WebGL supported
        // TODO: canvas renderer snapshot (using no WebGL supported method)

        renderer.sortObjects = false; // render in the order objects added to the scene
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // add listener
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
        document.addEventListener('mousewheel', onDocumentMouseWheel, false);
        document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
        document.addEventListener('dragover', function(event) {
            preventDefaultBrowser(event);
            event.dataTransfer.dropEffect = 'copy';
        }, false);

        document.addEventListener('dragenter', function(event) {
            document.body.style.opacity = 0.5;
        }, false);

        document.addEventListener('dragleave', function(event) {
            document.body.style.opacity = 1;
        }, false);

        document.addEventListener('drop', function(event) {
            preventDefaultBrowser(event);
            var reader = new FileReader();
            reader.addEventListener('load', function(event) {
                var fileType = event.target.result.slice(5, 10);
                console.log(fileType);

                if (fileType === 'image') {
                    material.map.image.src = event.target.result;
                    material.map.needsUpdate = true;
                }

                // TODO: video reader (bug: maybe readAsDataURL doesn't work)
                // 
                // if (fileType === 'video') {
                //     var video = document.createElement('video');
                //     // video.width = 640;
                //     // video.height = 360;
                //     video.autoplay = true;
                //     video.loop = true;
                //     video.src = event.target.result;

                //     texture = new THREE.VideoTexture(video);
                //     texture.minFilter = THREE.LinearFilter;

                //     material = new THREE.MeshBasicMaterial({
                //         map: texture
                //     });
                //     material.map.needsUpdate = true;
                // }

            }, false);
            // console.log(event.dataTransfer.files[0]);
            reader.readAsDataURL(event.dataTransfer.files[0]);

            document.body.style.opacity = 1;
        }, false);
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('keyup', function(key) {
            if (downloadLink.is(":visible") == true) {
                if (key.which === 83) {
                    downloadLink.fadeOut(600);
                    canvas.fadeOut(600);
                }
            } else
            // press 's'
            if (key.which === 83) {
                saveImage();
            }

            // press 'p'
            if (key.which === 80) {
                if (showObj) {
                    objects.forEach(function(item) {
                        item.visible = false;
                    });
                    showObj = false;
                } else {
                    objects.forEach(function(item) {
                        item.visible = true;
                    });
                    showObj = true;
                }
            }
            // if (key.which === 82)
            //  littlePlanet = !littlePlanet;
        });

        var snapshot = $('#snapshot');
        if (canvas.is(":visible") == false)
            snapshot.click(function(event) {
                // snapshot.prop('src', '../image/snapshot.png')
                var downloadLink = $('#downLink');
                if (downloadLink.is(":visible") == false)
                    saveImage();
            });
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        var canvas = $('#mycanvas');
        if (canvas.is(":visible") == true)
            drawCanvas();
    }

    function onDocumentMouseDown(event) {
        preventDefaultBrowser(event);

        isUserInteracting = true;

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

        onPointerDownTime = new Date().getTime();
        isInertiaMove = false;
    }

    function onDocumentMouseMove(event) {
        if (isUserInteracting === true) {
            deltaX = onPointerDownPointerX - event.clientX,
            deltaY = event.clientY - onPointerDownPointerY;

            lon = deltaX * 0.1 + onPointerDownLon;
            lat = deltaY * 0.1 + onPointerDownLat;
        }

        // check is hover something, and change the color
        if (showObj) {
            var hit = hitSomething(event);
            var isHit = hit[0];
            var hitObj = hit[1];
            if (isHit) {
                hitObj.material.color.set('orange');
            } else {
                objects.forEach(function(item) {
                    item.material.color.set('white');
                });
            }
        }

    }

    function onDocumentMouseUp(event) {
        isUserInteracting = false;

        // TODO: inertia moving effects

        // // inertia moving effects
        // var nowTime = new Date().getTime();

        // var inertiaRate =  0.4 * THREE.Math.clamp(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 
        //                    (nowTime - onPointerDownTime), 0, 1);
        // lon = deltaX * inertiaRate + event.clientX;
        // lat = deltaY * inertiaRate + event.clientY;



        // check if hit something, and change the sphere
        if (showObj) {
            var hit = hitSomething(event);
            var isHit = hit[0];
            var hitObj = hit[1];
            if (isHit) {
                // change the scene
                changeScene(hitObj.name);
            }
        }
    }

    function onDocumentMouseWheel(event) {
        // check FoV range
        if (camera.fov <= fovMax && camera.fov >= fovMin) {
            // WebKit (Safari / Chrome)
            if (event.wheelDeltaY) {
                camera.fov -= event.wheelDeltaY * 0.05;
            }
            // Opera / IE 9
            else if (event.wheelDelta) {
                camera.fov -= event.wheelDelta * 0.05;
            }
            // Firefox
            else if (event.detail) {
                camera.fov += event.detail * 1.0;
            }
        }

        if (camera.fov > fovMax) camera.fov = fovMax;
        if (camera.fov < fovMin) camera.fov = fovMin;

        camera.updateProjectionMatrix();
    }

    function preventDefaultBrowser(event) {
        // Chrome / Opera / Firefox
        if (event.preventDefault)
            event.preventDefault();
        // IE 9
        event.returnValue = false;
    }

    function hitSomething(event) {
        // If hit the objects(and the objects are visible!)
        // ref: http://goo.gl/eQmcX3

        var mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, //x
            -(event.clientY / window.innerHeight) * 2 + 1, //y
            0.5); //z
        mouse3D.unproject(camera);
        mouse3D.sub(camera.position);
        mouse3D.normalize();
        var raycaster = new THREE.Raycaster(camera.position, mouse3D);
        var intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            // return which object is hit
            for (var i = 0; i < objects.length; i++) {
                if (intersects[0].object.position.distanceTo(objects[i].position) < 10) {
                    return [true, objects[i]];
                }
            }
        } else
            return [false, null];
    }

    function addObject() {
        nowSphere = flyInfo.sphere[nowSphereID];
        for (var i = 0; i < nowSphere.transition.length; i++) {
            var nowTransition = nowSphere.transition[i];
            var latObj = nowTransition.position.lat,
                lonObj = nowTransition.position.lon,
                objBoxSize = nowTransition.position.size;
            // add some objects
            var radiusObj = 70;

            phiObj = THREE.Math.degToRad(90 - latObj);
            thetaObj = THREE.Math.degToRad(lonObj);

            var geometryObj = new THREE.BoxGeometry(objBoxSize, objBoxSize, 0);
            var materialObj = new THREE.MeshBasicMaterial({
                color: 'white',
                opacity: 0.2
            });
            materialObj.transparent = true;
            var sphereObj = new THREE.Mesh(geometryObj, materialObj);

            var xObj = radiusObj * Math.sin(phiObj) * Math.cos(thetaObj),
                yObj = radiusObj * Math.cos(phiObj),
                zObj = radiusObj * Math.sin(phiObj) * Math.sin(thetaObj);
            sphereObj.position.set(xObj, yObj, zObj);

            sphereObj.rotation.set(0, (Math.sin(thetaObj) - 1) * Math.PI / 2, 0);
            // record obj's position for checking whether hitting objs
            sphereObj.name = nowTransition.nextSceneID;
            scene.add(sphereObj);
            objects.push(sphereObj);
        }
    }

    function changeScene(_nextSceneID) {
        // remove all object in the scene (except for the last sphere)
        console.log(nowSphereID);
        if (scene.children.length > 1) {
            for (var i = 1; i <= scene.children.length - 1; i++) {
                scene.remove(scene.children[i]);
            }
        }

        var nowMap = './image/fly/' + nowSphereID + '.jpg';
        var nextMap = './image/fly/' + _nextSceneID + '.jpg';

        texture2 = new THREE.ImageUtils.loadTexture(nextMap);
        texture2.minFilter = THREE.LinearFilter;

        material2 = new THREE.MeshBasicMaterial({
            map: texture2,
            overdraw: true
        });

        mesh2 = new THREE.Mesh(geometry2, material2);
        material2.transparent = true;

        scene.add(mesh2);

        // remove all elements in objects array
        objects.length = 0;
        nowSphereID = _nextSceneID;

        isAnimate = true;
        material2.opacity = 0;
    }

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
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
                var theta = THREE.Math.degToRad(camera.fov / 2);
                var img_width = 1 / Math.cos(theta);
                img_width = img_width * Math.sin(theta) * 0.8;
                var flash = $('#flash');
                camera.fov = Math.atan(img_width);
                camera.fov = camera.fov * 180 / Math.PI * 2;
                camera.updateProjectionMatrix();
                objects.forEach(function(item) {
                    item.visible = false;
                });
                renderer.render(scene, camera);
                capImg = renderer.domElement.toDataURL('image/jpeg');
                objects.forEach(function(item) {
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
    }

    function drawCanvas() {
        var canvas = $('#mycanvas');
        canvas.fadeIn(500);
        canvas = document.getElementById('mycanvas');
        canvas.height = window.innerHeight * 0.8;
        canvas.width = window.innerWidth * 0.8;
        var context = canvas.getContext('2d');
        context.beginPath();
        context.rect(0, 0, window.innerWidth * 0.8, window.innerHeight * 0.8);
        context.lineWidth = 7;
        context.moveTo(window.innerWidth * 0.4 - 30, window.innerHeight * 0.4);
        context.lineTo(window.innerWidth * 0.4 + 30, window.innerHeight * 0.4);
        context.lineWidth = 7;
        context.moveTo(window.innerWidth * 0.4, window.innerHeight * 0.4 - 30);
        context.lineTo(window.innerWidth * 0.4, window.innerHeight * 0.4 + 30);
        context.lineWidth = 7;
        context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        context.stroke();
    }

    function initStats() {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $('#Stats-output').append(stats.domElement);
        return stats;
    }

    //   function littlePlanetEffect() {
    //      if (littlePlanet) {
    //          camPos.copy(camera.position);
    //          camera.position.copy( camera.target ).negate();  fovMax = 300;
    //          littlePlanet = false;
    //      }
    //      else {
    //  littlePlanet = true;
    //  camera.position = camPos;
    //  fovMax = 100;
    //  if (camera.fov > 100) camera.fov = 100;
    //      }
    // // Little planet effect
    // // FoV = 160, Lat = -85, Lon = 85, and also set fovMax = 300
    // // position of the camera from center to the circle of the sphere (opposite side of camera target)

    //   }

    function renderScene() {
        if (isAnimate) {
            var fadeInSpeed = 0.03; // ms
            if (material2.opacity >= 1) {
                isAnimate = false;
                scene.remove(scene.children[0]); // remove last sphere
                requestAnimationFrame(update);
                addObject();
                return 0;
            }
            material2.opacity += fadeInSpeed;
            requestAnimationFrame(renderScene);
            renderer.render(scene, camera);
            stats.update();
        } else {
            requestAnimationFrame(update);
            renderer.render(scene, camera);
        }
    }

    function update() {
        lat = Math.max(-85, Math.min(85, lat));
        lon = (lon + 360) % 360;
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);

        var camFOV = $('#fov');
        camFOV.text('FoV: ' + Math.round(camera.fov * 100) / 100 + ' Lat:' + Math.round(lat * 100) / 100 + ' Lon:' + Math.round(lon * 100) / 100);

        // y: up
        camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
        camera.target.y = 500 * Math.cos(phi);
        camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
        camera.lookAt(camera.target);

        // Little planet effect
        // FoV = 160, Lat = -85, Lon = 85, and also set fovMax = 300
        // position of the camera from center to the circle of the sphere (opposite side of camera target)
        // camera.position.copy( camera.target ).negate();   fovMax = 300;

        // littlePlanetEffect();
        stats.update();
        renderScene();
    }
}); // end of jQuery