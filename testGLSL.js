$(document).ready(function() {
    // Three.js GLOBAL scene objects
    var camera, scene, geometry, material, mesh, renderer;

    // some objects on the scene
    var objects = [],
        showObj = true;

    var defaultMap = './image/map/3.jpg';
    var defaultMap2 = './image/map/2.jpg';

    var camPos = new THREE.Vector3(0, 0, 0),
        isUserInteracting = false,
        lon = 0, // default: 0
        lat = 0, // default: 0
        camFOV_dafault = 70,
        onMouseDownMouseX = 0,
        onMouseDownMouseY = 0,
        onMouseDownLon = 0,
        onMouseDownLat = 0,
        phi = 0,
        theta = 0;

    // setting the constrained FoV
    var fovMax = 100,
        fovMin = 60;
    var sphereSize = 100;

    var urlHash = window.location.hash;
    // console.log(isNaN(urlHash));

    // timer for scroll stop
    var timer = null;

    // initialization
    var stats = initStats();
    init();
    update();

    function init() {
        // virtual camera canvas (for cropping image)
        var container, mesh;
        container = document.getElementById('container');
        camera = new THREE.PerspectiveCamera(
            camFOV_dafault, // Field of View
            window.innerWidth / window.innerHeight, // Aspect Ratio
            1, // Near Plane
            1100 // Far Plane
        );
        // change the positon of the camera
        camera.target = new THREE.Vector3(sphereSize, sphereSize, sphereSize);
        scene = new THREE.Scene();

        geometry = new THREE.SphereGeometry(sphereSize, 60, 40, 0 * Math.PI/2 , Math.PI/2);
        // geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1)); // inside-out

        // for changing scene
        geometry2 = new THREE.SphereGeometry(sphereSize, 60, 40, 1 * Math.PI , Math.PI);

        // load texture
        texture = new THREE.ImageUtils.loadTexture(defaultMap);
        texture.minFilter = THREE.LinearFilter;
        material = new THREE.MeshBasicMaterial({
            map: texture,
            overdraw: true
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.scale.x = -1;
        scene.add(mesh);

        // load texture
        texture2 = new THREE.ImageUtils.loadTexture(defaultMap2);
        texture2.minFilter = THREE.LinearFilter;
        material2 = new THREE.MeshBasicMaterial({
            map: texture2,
            overdraw: true
        });

        mesh2 = new THREE.Mesh(geometry2, material2);
        mesh2.scale.x = -1;


        scene.add(mesh2);

        // WebGLRenderer for better quality if had webgl
        renderer = Detector.webgl ? new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            autoClearColor: false
        }) : new THREE.CanvasRenderer(); // with no WebGL supported
        // TODO: canvas renderer snapshot (using no WebGL supported method)

        renderer.sortObjects = false; // render in the order objects added to the scene
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
    }

    function onDocumentMouseDown(event) {
        preventDefaultBrowser(event);

        isUserInteracting = true;

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;
    }

    function onDocumentMouseMove(event) {
        if (isUserInteracting === true) {
            deltaX = onPointerDownPointerX - event.clientX,
            deltaY = event.clientY - onPointerDownPointerY;

            lon = deltaX * 0.1 + onPointerDownLon;
            lat = deltaY * 0.1 + onPointerDownLat;
        }
    }

    function onDocumentMouseUp(event) {
        isUserInteracting = false;
    }

    function preventDefaultBrowser(event) {
        // Chrome / Opera / Firefox
        if (event.preventDefault)
            event.preventDefault();
        // IE 9
        event.returnValue = false;
    }

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    function clamp(number, min, max) {
        return number > max ? max : (number < min ? min : number);
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

    function renderScene() {
        requestAnimationFrame(update);
        renderer.render(scene, camera);

    }

    function update() {
        lat = Math.max(-85, Math.min(85, lat));
        lon = (lon + 360) % 360;
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);

        var camFOV = $('#fov');
        camFOV.text('FoV: ' + Math.round(camera.fov * 100) / 100 +
            ' Lat:' + Math.round(lat * 100) / 100 +
            ' Lon:' + Math.round(lon * 100) / 100);

        // y: up
        camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
        camera.target.y = 500 * Math.cos(phi);
        camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
        camera.lookAt(camera.target);

        stats.update();
        renderScene();
    }
}); // end of jQuery