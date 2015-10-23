// require Express
var express = require('express');
var bodyParser = require('body-parser')
require( "console-stamp" )( console, {
    colors: {
        stamp: "yellow",
        label: "white"
    }
} );

var app = express();
app.set ('views', __dirname + '/views');
app.set ('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var viewCount=0;
app.get('/', function(req, res) {
  // res.send('hello!!');
  viewCount += 1;
  res.render('index.ejs',{"viewCount":viewCount})
});

app.get('/get', function (req, res) {
  console.log(req.method + ": " + req.query.id);
  return res.send({
      "PanoID": "00000000",
      "imageServer": [],
      "heading": 0,
      "transition":
      [
        {
          "lat": -17,
          "lng": -60,
          "size": 22,
          "rotateX": 95,
          "rotateY": 100,
          "rotateZ": 0,
          "objSphereRadius": 90,
          "nextID": "00000001"
        }
      ]
    })
});

app.get('/metadata', function (req, res) {
  console.log(req.method + "  'PanoID' : " + req.query.id);
  var transInfo = {
    "00000000":
    {
      "PanoID": "00000000",
      "imageServer": ['http://local.host:1337/images/'],
      "heading": 0,
      "transition":
      [
        {
          "lat": -17,
          "lng": -60,
          "size": 22,
          "rotateX": 95,
          "rotateY": 100,
          "rotateZ": 0,
          "objSphereRadius": 90,
          "nextID": "00000001"
        }
      ]
    },
    "00000001":
    {
      "PanoID": "00000001",
      "imageServer": ['http://local.host:1337/images/'],
      "heading": 280,
      "transition":
      [
        {
          "lat": -15,
          "lng": 32.7,
          "size": 30,
          "rotateX": 90,
          "rotateY": 65,
          "rotateZ": 0,
          "objSphereRadius": 90,
          "nextID": "00000000"
        },
        {
          "lat": -10,
          "lng": 274,
          "size": 25,
          "rotateX": 90,
          "rotateY": -185,
          "rotateZ": 0,
          "objSphereRadius": 90,
          "nextID": "00000002"
        }
      ]
    },
    "00000002":
    {
      "PanoID": "00000002",
      "imageServer": ['http://local.host:1337/images/'],
      "heading": 275.8,
      "transition":
      [
        {
          "lat": -16,
          "lng": 78,
          "size": 60,
          "rotateX": 95,
          "rotateY": 25,
          "rotateZ": 1,
          "objSphereRadius": 90,
          "nextID": "00000001"
        },
        {
          "lat": -20,
          "lng": 268.9,
          "size": 30,
          "rotateX": 90,
          "rotateY": -180,
          "rotateZ": 0,
          "objSphereRadius": 90,
          "nextID": "00000003"
        }
      ]
    },
    "00000003":
    {
      "PanoID": "00000003",
      "imageServer": ['http://local.host:1337/images/'],
      "heading": 270.3,
      "transition":
      [
        {
          "lat": -20,
          "lng": 85.7,
          "size": 30,
          "rotateX": 90,
          "rotateY": 10,
          "rotateZ": 1,
          "objSphereRadius": 90,
          "nextID": "00000002"
        }
      ]
    }
  };

  return res.send(transInfo[req.query.id]);
});

app.listen(1337, function () {
    console.log('ready on port 1337');
});