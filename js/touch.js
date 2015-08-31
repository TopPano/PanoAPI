// (function(window) {

//         // check for touch
//         if (Modernizr.touch) {
//             document.addEventListener('touchstart', function(event) {
//                 preventDefaultBrowser(event);
//                 isUserInteracting = true;
//                 var touchNum = event.touches.length;
//                 if (touchNum === 1) {
//                     TouchNumber = 1;
//                     onTouchStartPointerX = event.touches.item(0).pageX;
//                     onTouchStartPointerY = event.touches.item(0).pageY;

//                     onTouchStartLon = lon;
//                     onTouchStartLat = lat;
//                 }
//                 if (touchNum === 2) {
//                     TouchNumber = 2;
//                     onTouchStartPointerX0 = event.touches.item(0).pageX;
//                     onTouchStartPointerY0 = event.touches.item(0).pageY;
//                     onTouchStartPointerX1 = event.touches.item(1).pageX;
//                     onTouchStartPointerY1 = event.touches.item(1).pageY;

//                     deltaStartDisX = onTouchStartPointerX1 - onTouchStartPointerX0;
//                     deltaStartDisY = onTouchStartPointerY1 - onTouchStartPointerY0;
//                     deltaStart = deltaStartDisX * deltaStartDisX + deltaStartDisY * deltaStartDisY;
//                     deltaStart = Math.sqrt(deltaStart);
//                     TouchNumber = 2;
//                     deltaMove_last = deltaStart;
//                 }

//             });

//             document.addEventListener('touchmove', function(event) {
//                 if (isUserInteracting === true) {
//                     var touchNum = event.touches.length;
//                     if (touchNum === 1) {
//                         // remove abnormal behaviors caused from one-finger-touch after pinching
//                         if (TouchNumber === 2) {
//                             sleep(200);
//                             return;
//                         }
//                         deltaX = onTouchStartPointerX - event.touches.item(0).pageX,
//                         deltaY = event.touches.item(0).pageY - onTouchStartPointerY;

//                         lon = deltaX * 0.2 + onTouchStartLon;
//                         lat = deltaY * 0.2 + onTouchStartLat;
//                     }
//                     if (touchNum === 2) {
//                         onTouchMovePointerX0 = event.touches.item(0).pageX;
//                         onTouchMovePointerY0 = event.touches.item(0).pageY;
//                         onTouchMovePointerX1 = event.touches.item(1).pageX;
//                         onTouchMovePointerY1 = event.touches.item(1).pageY;

//                         deltaMoveDisX = onTouchMovePointerX1 - onTouchMovePointerX0;
//                         deltaMoveDisY = onTouchMovePointerY1 - onTouchMovePointerY0;
//                         deltaMove = deltaMoveDisX * deltaMoveDisX + deltaMoveDisY * deltaMoveDisY;
//                         deltaMove = Math.sqrt(deltaMove);
//                         deltaDis = deltaMove - deltaStart;

//                         // fingers closer (and also check FoV range)
//                         if (deltaDis < 0 && camera.fov <= fovMax && camera.fov >= fovMin) {
//                             // if from closer to futher
//                             if (deltaMove > deltaMove_last)
//                                 deltaStart = deltaMove;
//                             else
//                                 camera.fov -= deltaDis * 0.04;
//                         }
//                         // fingers further
//                         if (deltaDis > 0 && camera.fov <= fovMax && camera.fov >= fovMin) {
//                             // if from futher to closer
//                             if (deltaMove < deltaMove_last)
//                                 deltaStart = deltaMove;
//                             else
//                                 camera.fov -= deltaDis * 0.04;
//                         }

//                         if (camera.fov > fovMax) camera.fov = fovMax;
//                         if (camera.fov < fovMin) camera.fov = fovMin;

//                         camera.updateProjectionMatrix();
//                         deltaMove_last = deltaMove;
//                     }
//                 }
//             });

//             document.addEventListener('touchend', function(event) {
//                 isTouch = true;
//                 if (showObj) {
//                     var hit = hitSomething(event);
//                     var isHit = hit[0];
//                     var hitObj = hit[1];
//                     if (isHit) {
//                         // change the scene
//                         changeScene(hitObj.name);
//                     }
//                 }

//                 deltaStart = 0;
//                 deltaMove = 0;
//                 deltaMove_last = 0;
//                 // TODO: change the URL with hash in mobile devices 
//                 updateURL();
//             });

//         })(window);