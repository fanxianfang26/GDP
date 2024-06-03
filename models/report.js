const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name: String,
  url: String,
  order: Number, 
  visible: Boolean
});

module.exports = mongoose.model('Report', reportSchema);