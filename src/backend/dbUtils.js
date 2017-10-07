var mongoose = require('mongoose');
var Video = require('./model/video');
var Comment = require('./model/comment');

var dbUtils = {
  buildComment: newCommentData => {
    var newComment = new Comment(newCommentData);

    return newComment;
  },

  saveComment: (comment, res) => {
    comment.save(function(err) {
      if (err) {
        res.send(err);
      }
    });
  }
}

module.exports = dbUtils;