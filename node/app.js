// require Express
var express = require('express');
var bodyParser = require('body-parser')

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

app.put('/hi', function (req, res) {
  console.log("Request method :" + req.method);
  console.log("Request body :" + req.body.PanoID);
  var transInfo = {
    "00000000":
    {
      "PanoID": "00000000",
      "heading": 0,
      "transition":
      [
        {
          "lat": -17,
          "lng": -60,
          "size": 22,
          "rotateX": 95,
          "rotateY": 0,
          "rotateZ": -100,
          "nextID": "00000001"
        }
      ]
    },
    "00000001":
    {
      "PanoID": "00000001",
      "heading": 280,
      "transition":
      [
        {
          "lat": -15,
          "lng": 32.7,
          "size": 30,
          "rotateX": 90,
          "rotateY": 0,
          "rotateZ": -65,
          "nextID": "00000000"
        },
        {
          "lat": -10,
          "lng": 274,
          "size": 25,
          "rotateX": 90,
          "rotateY": 0,
          "rotateZ": 189,
          "nextID": "00000002"
        }
      ]
    },
    "00000002":
    {
      "PanoID": "00000002",
      "heading": 275.8,
      "transition":
      [
        {
          "lat": -16,
          "lng": 78,
          "size": 60,
          "rotateX": 95,
          "rotateY": 1,
          "rotateZ": -25,
          "nextID": "00000001"
        },
        {
          "lat": -20,
          "lng": 268.9,
          "size": 30,
          "rotateX": 90,
          "rotateY": 0,
          "rotateZ": 180,
          "nextID": "00000003"
        }
      ]
    },
    "00000003":
    {
      "PanoID": "00000003",
      "heading": 270.3,
      "transition":
      [
        {
          "lat": -20,
          "lng": 85.7,
          "size": 30,
          "rotateX": 90,
          "rotateY": 1,
          "rotateZ": -10,
          "nextID": "00000002"
        }
      ]
    }
  };

  return res.send(transInfo[req.body.PanoID]);
});

app.listen(1337, function () {
    console.log('ready on port 1337');
});