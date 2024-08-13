const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socialMediaSchema = new Schema({
  youtube: {
    type: String,
    trim: true,
    default: ''
  },
  tiktok: {
    type: String,
    trim: true,
    default: ''
  },
  instagram: {
    type: String,
    trim: true,
    default: ''
  },
  facebook: {
    type: String,
    trim: true,
    default: ''
  }
});

const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);

module.exports = SocialMedia;
