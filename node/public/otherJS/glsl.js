// 	 <script id="vertexShader" type="x-shader/x-vertex">
// varying vec2 vUv;
// void main() {
//   vUv = uv;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
// }
//   </script>

//   <script id="fragmentShader" type="x-shader/x-fragment">
// uniform vec3 color1;
// uniform vec3 color2;
// uniform float radius1;
// uniform float radius2;
// uniform float amount;
// varying vec2 vUv;
// void main() {
//   //float p = abs(fract(amount*vUv.x)*2.0-1.0);
//   float p = smoothstep(radius1, radius2, length(fract(amount*vUv)-0.5));
//   vec3 col = mix(color1, color2, vec3(p));
//   gl_FragColor = vec4(col, 1.0);
// }
//   </script>