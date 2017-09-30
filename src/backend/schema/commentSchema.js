var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  message: String,
  author: String,
  startTime: Number,
  endTime: Number,
  score: Number
});

module.exports = commentSchema;