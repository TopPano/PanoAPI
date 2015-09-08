var test = TOPPANO;

test.printError('hihihi');
test.drawCanvas();

// var la = new TOPPANO.LatLng(123, 11);
// console.log(la.toUrlValue());

var sz = new TOPPANO.Size(123, 11);
console.log(sz.equals(123,11.01));

var pa = new TOPPANO.Panorama({lat: 433, lng:99, visible: false, fov: 12});
// pa.setVisible(false);
console.log(pa.getZoom());