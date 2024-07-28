const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

  } catch (error) {
    console.error('MongoDB Connection Error:', error);

  }
};

module.exports = connectDb;
