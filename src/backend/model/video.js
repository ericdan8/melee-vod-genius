var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
  id: String,
  comments: Array
})

var ex = mongoose.model('Video', videoSchema);

module.exports = ex;