var test = TOPPANO;

// test.printError('hihihi');
// test.drawCanvas();
test.init();

var calc = document.getElementById('fov');
hide(calc);

// var la = new TOPPANO.LatLng(123, 11);
// console.log(la.toUrlValue());

var sz = new TOPPANO.Size(123, 11);
console.log(sz.equals(123,11.01));

var pa = new TOPPANO.Panorama({lat: 433, lng:99, visible: false});
// pa.setVisible(false);
console.log(pa.getZoom());

var u = new TOPPANO.URL();
console.log(typeof u.toUrlValue());