var mongoose = require('mongoose');
var Video = require('./model/video');
var Comment = require('./model/comment');

var dbUtils = {
  buildComment: newCommentData => {
    var newComment = new Comment(newCommentData);

    return newComment;
  },

  saveDocument: (doc, res) => {
    doc.save(function(err) {
      if (err) {
        res.send(err);
      }
    });
  }
}

module.exports = dbUtils;