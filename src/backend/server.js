var express = require('express');

var app = express();

app.get('/', (req, res, next) => {
  console.log('request received!');
  res.json({"message": "welcome!"});
});

app.listen(3001, () => console.log('server started'));