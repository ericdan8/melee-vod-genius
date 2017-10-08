var mongoose = require('mongoose');
var CommentSchema = require('./commentSchema');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
  videoId: String,
  comments: [{type: Schema.ObjectId, ref: 'Comment'}]
})

module.exports = videoSchema;