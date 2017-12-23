var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Video = require('./model/video');
var Comment = require('./model/comment');
var bodyParser = require('body-parser');
var dbUtils = require('./dbUtils');

var app = express();

var port = process.env.API_PORT || 3001;
var mongoDB = 'mongodb://admin:admin@ds155934.mlab.com:55934/vod-genius';
mongoose.connect(mongoDB, { useMongoClient: true });

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
  console.log('GET request received');
});

// GET a video's comments by ID
app.get('/api/video/:videoId', (req, res, next) => {
  Video.find({videoId: req.params.videoId}, function(err, video) {
    if (err) {
      res.send(err);
    }
    console.log('serving video ' + req.params.videoId);
    if (video.length < 1) {
      // create a new video
      video = new Video();
      
      video.videoId = req.params.videoId;
      video.comments = [];
      video.save(function(err, newVideo) {
        // do stuff with the updated video
        console.log('created new' + req.param.videoId);
        res.json(newVideo);
      });
    } else {
      // serve an existing video
      video[0].populate('comments', function(err, vid) {
        res.json(video[0]);
      });
    }
  });
});

app.post('/api/video/:videoId', (req, res, next) => {
  Video.find({videoId: req.params.videoId}, function(err, video) {
    if (err) {
      res.send(err);
    }
    console.log('updating video ' + req.params.videoId);

    var newComment = new Comment(req.body);

    dbUtils.saveDocument(newComment);

    // first comment on a particular video 
    if (video.length < 1) {
      video = new Video();
      video.videoId = req.params.videoId;
      video.comments = [newComment._id];
      video.save(function(err, newVideo) {
        // do stuff with the updated video
        console.log('created new' + req.param.videoId);
        res.json(newVideo);
      });
    }
    else {
      video = video[0];
      video.comments.push(newComment._id);
    }

    video.save(function(err, updatedVideo) {
      // do stuff with the updated video
      console.log('new comment added to video ' + req.param.videoId);
      res.json(updatedVideo);
    });
  });
});

app.listen(3001, () => console.log('server started'));