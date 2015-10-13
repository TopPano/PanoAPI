// require Express
var express = require('express');

var app = express();
app.set ('views', __dirname + '/views');
app.set ('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var viewCount=0;
app.get('/', function(req, res) {
  // res.send('hello!!');
  viewCount += 1;
  res.render('index.ejs',{"viewCount":viewCount})
});

app.put('/hi', function (req, res) {
  console.log("Request method :" + req.method);
  console.log("Request body :" + req.body);
  var hi = {
    "PanoID": "00000003",
    "heading": 270.3,
    "transition": [
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
  return res.send(hi);
});

// app.get('/:folder', function(req, res) {
//     res.send('hello, ike!');
//     var metaData = req.query;
//     console.log("PanoID: " + metaData.PanoID);
//     console.log("heading: " + metaData.heading);
//     console.log("PanoID: " + metaData.PanoID);
//     console.log("heading: " + metaData.heading);
//     console.log(req.params.folder);
//     console.log('connecting...');
// });

app.listen(1337, function () {
    console.log('ready on port 1337');
});