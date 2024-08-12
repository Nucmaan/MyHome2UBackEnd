const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // Update to match environment variable name
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

module.exports = cloudinary;
