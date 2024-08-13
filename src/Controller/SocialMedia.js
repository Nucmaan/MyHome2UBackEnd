const SocialMedia = require('../Model/SocialMedia');

const createSocialMediaLink = async (req, res, next ) => {
  try {
    const { youtube, tiktok, instagram, facebook } = req.body;
    const newSocialMediaLink = new SocialMedia({
      youtube,
      tiktok,
      instagram,
      facebook
    });
    await newSocialMediaLink.save();
    res.status(200).json({ message: 'Social media link created successfully', data: newSocialMediaLink });
  } catch (error) {
    next(error);
  }
};


const getAllSocialMediaLinks = async (req, res, next) => {
  try {
    const links = await SocialMedia.findOne(); 
    res.status(200).json({ data: links });
  } catch (error) {
    next(error);
  }
};


const updateSocialMediaLink = async (req, res, next) => {
  try {
    const { youtube, tiktok, instagram, facebook } = req.body;
    const updatedLink = await SocialMedia.findOneAndUpdate(
      {}, 
      { youtube, tiktok, instagram, facebook },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: 'Social media link updated successfully', data: updatedLink });
  } catch (error) {
    next(error);
  }
};

const deleteSocialMediaLink = async (req, res, next) => {
  try {
    await SocialMedia.deleteOne({}); // Delete the single document
    res.status(200).json({ message: 'Social media link deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    createSocialMediaLink,
    deleteSocialMediaLink,
    updateSocialMediaLink,
    getAllSocialMediaLinks
}
