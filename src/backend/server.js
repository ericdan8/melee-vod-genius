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
      if (video.length) {
        // add the new comment to the video
        var newCommentData = JSON.parse(req.query.newComment);
        var doc = video[0];
        var newComment = new Comment(newCommentData);
        console.log(video);
        console.log(doc);
        doc.comments.push(newComment._id);

        newComment.save(function(err) {
          if (err) {
            res.send(err);
          }
        });
        doc.save(function(err, updatedVideo) {
          // do stuff with the updated video
          console.log('new comment added!');
          res.json(updatedVideo);
        });
      } else {
        next();
      }
    });
  },
  (req, res, next) => {
    var video = new Video();
    var newCommentData = JSON.parse(req.query.newComment);
    var newComment = new Comment(newCommentData);
    
    video.videoId = req.params.videoId;
    video.comments = [newComment._id];
    console.log(video);
    newComment.save(function(err) {
      if (err) {
        res.send(err);
      }
    });
    video.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'video successfully added!' });
    });
  }
);

app.listen(3001, () => console.log('server started'));