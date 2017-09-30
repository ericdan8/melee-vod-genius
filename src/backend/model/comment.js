var mongoose = require('mongoose');
var CommentSchema = require('../schema/commentSchema');

var commentModel = mongoose.model('Comment', CommentSchema);

module.exports = commentModel;