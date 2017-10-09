var mongoose = require('mongoose');
var VideoSchema = require('../schema/videoSchema');

var videoModel = mongoose.model('Video', VideoSchema);

module.exports = videoModel;