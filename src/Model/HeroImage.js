const mongoose = require('mongoose');

const HeroImageSchema = new mongoose.Schema({
  imageUrl: {
    public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
  },
},
 { timestamps: true }
);

module.exports = mongoose.model('HeroImage', HeroImageSchema);
