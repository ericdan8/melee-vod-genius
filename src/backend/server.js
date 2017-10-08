var express = require('express');
var mongoose = require('mongoose');
var Video = require('./model/video');
var Comment = require('./model/comment');
var bodyParser = require('body-parser');
var dbUtils = require('./dbUtils');

var app = express();

var port = process.env.API_PORT || 3001;
var mongoDB = 'mongodb://admin:admin@ds155934.mlab.com:55934/vod-genius';
mongoose.connect(mongoDB, { useMongoClient: true })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
 });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  console.log('request received!');
  res.json({"message": "welcome!"});
});

// GET a video's comments by ID
app.get('/api/video/:videoId', (req, res, next) => {
  Video.find({videoId: req.params.videoId}, function(err, video) {
    if (err) {
      res.send(err);
    }
    console.log(video);
    res.json(video);
  });
});

// First-time init for a video

app.post('/api/video/:videoId', 
  (req, res, next) => {
    Video.find({videoId: req.params.videoId}, function(err, video) {
      if (err) {
        res.send(err);
      }
      var newCommentData = JSON.parse(req.query.newComment);
      var newComment = new Comment(newCommentData);


      dbUtils.saveDocument(newComment);

      if (video.length < 1) {
        video = new Video();
        
        video.videoId = req.params.videoId;
        video.comments = [newComment._id];
      }
      else {
        video = video[0];
        video.comments.push(newComment._id);
      }

      video.save(function(err, updatedVideo) {
        // do stuff with the updated video
        console.log('new comment added!');
        res.json(updatedVideo);
      });
    });
  }
);

app.listen(3001, () => console.log('server started'));