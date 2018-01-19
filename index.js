var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require('path');
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

con.connect(err => {
  if (err) throw err;
  else console.log('Connected to database!');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/video/:videoId', (req, res, next) => {
  if (req.params.videoId) {
    console.log('serving video ' + req.params.videoId);
    var sql = `
      SELECT message, startTime, endTime, author, score
      FROM video_comment_map
      JOIN comments
        ON comments.id = video_comment_map.commentId
      WHERE videoId = \"${req.params.videoId}\";
    `
    con.query(sql, (err, result) => {
      if (err) res.send(err);
      else res.json({ comments: result });
    });
  }
});

app.post('/api/video/:videoId', (req, res, next) => {
  if (req.params.videoId) {
    console.log('adding comment to video ' + req.params.videoId);
    var { message, startTime, endTime, author } = req.body;
    var commentSql = `
      INSERT INTO comments (message, startTime, endTime, author)
      VALUES (\"${message}\", ${startTime}, ${endTime}, \"${author}\");
    `
    // add the new comment
    con.query(commentSql, (err, result) => {
      if (err) res.send(err);
      var { insertId } = result;
      var mapSql = `
        INSERT INTO video_comment_map (videoId, commentId)
        VALUES (\"${req.params.videoId}\", ${insertId});
      `
      // map the new comment to the given video
      con.query(mapSql, (err, result) => {
        if (err) res.send(err);
        else res.json(result);
      });
    });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(3001, () => console.log('server started'));