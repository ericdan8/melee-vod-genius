var mongoose = require('mongoose');
var VideoSchema = require('../schema/videoSchema')
var CommentSchema = require('../schema/commentSchema');

var videoModel = mongoose.model('Video', VideoSchema);

module.exports = videoModel;