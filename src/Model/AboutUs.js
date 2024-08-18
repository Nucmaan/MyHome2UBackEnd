const mongoose = require("mongoose");

const AboutUsSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    required: true,
  },
  sectionContent: {
    type: String,
    required: true,
  },
  sectionImage: {
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
{
    timestamps: true,
  }
);

module.exports = mongoose.model("AboutUs", AboutUsSchema);
