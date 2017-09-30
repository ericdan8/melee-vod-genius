var express = require('express');
var mongoose = require('mongoose');
var Video = require('./model/video');
var bodyParser = require('body-parser');

var app = express();

var port = process.env.API_PORT || 3001;
var mongoDB = 'mongodb://admin:admin@ds155934.mlab.com:55934/vod-genius';
mongoose.connect(mongoDB, { useMongoClient: true })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  console.log('request received!');
  res.json({"message": "welcome!"});
});

// GET a video's comments by ID
app.get('/api/video/:videoId', (req, res, next) => {
  Video.find({id: req.params.videoId}, function(err, video) {
    if (err) {
      res.send(err);
    }
    res.json(video.comments);
  });
});

// First-time init for a video
app.post('/api/video/', (req, res, next) => {
  var video = new Video();
  
  var comments = JSON.parse(req.query.comments);
  console.log('starting post attempt...');
  //body parser lets us use the req.body]
  video.id = req.query.id;
  video.comments = comments;
  console.log(video);
  video.save(function(err) {
    console.log("callback called");
    if (err) {
      res.send(err);
    }
    res.json({ message: 'video successfully added!' });
  });
});

app.listen(3001, () => console.log('server started'));