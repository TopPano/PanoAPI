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

app.get('/:folder', function(req, res) {
    res.send('hello, ike!');
    var metaData = req.query;
    console.log("PanoID: " + metaData.PanoID);
    console.log("heading: " + metaData.heading);
    console.log("PanoID: " + metaData.PanoID);
    console.log("heading: " + metaData.heading);
    console.log(req.params.folder);
    console.log('connecting...');
});

app.listen(1337, function () {
    console.log('ready on port 1337');
})