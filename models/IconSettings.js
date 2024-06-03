const mongoose = require('mongoose');

const iconSettingsSchema = new mongoose.Schema({
  rows: Number,
  columns: Number
});

module.exports = mongoose.model('IconSettings', iconSettingsSchema);