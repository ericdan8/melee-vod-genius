var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
require('dotenv').config();

var app = express();

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

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');
  console.log('using VOD genius');
  con.query('SELECT * FROM comments', function (err, result) {
    if (err) throw err;
  });
});

app.get('/api/video/:videoId', (req, res, next) => {
  if (req.params.videoId) {
    var sql = `
      SELECT message, startTime, endTime, author, score
      FROM video_comment_map
      JOIN comments
        ON comments.id = video_comment_map.commentId
      WHERE videoId = \"${req.params.videoId}\"
    `
    con.query(sql, (err, result) => {
      // TODO: do stuff with the result here
    });
    res.json(sql);
  }
});

app.listen(3001, () => console.log('server started'));