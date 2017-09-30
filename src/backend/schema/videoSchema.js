var mongoose = require('mongoose');
var CommentSchema = require('./commentSchema');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
  id: String,
  comments: [CommentSchema]
})

module.exports = videoSchema;