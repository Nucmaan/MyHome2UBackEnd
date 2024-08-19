const ErrorHandler = require("../Utils/error");
const cloudinary = require("../MiddleWare/Cloudinary.js");
const { default: mongoose } = require("mongoose");
const HeroImage = require("../Model/HeroImage.js");


const AdHeroImage = async (req, res, next) => {
  try {

    const heroImage = req.file;

    if (!heroImage) {
      return next(ErrorHandler(400, "Image is required"));
    }

    const result = await cloudinary.uploader.upload(heroImage.path, {
      folder: "MyHome2U/HeroImage",
    });

    const newHeroImage = await HeroImage.create({
      imageUrl: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "HeroImage added successfully",
      HeroImage: newHeroImage,
    });
  } catch (error) {
    next(error);
  }
};

const getHeroImage = async (req, res, next) => {
    try {
      const heroImages = await HeroImage.find({});
      res.status(200).json({
        success: true,
        heroImages,
      });
    } catch (error) {
      next(error);
    }
  };

  const GetSingleHeroImage = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(ErrorHandler(400, "Invalid HeroImage ID"));
      }

      const heroImage = await HeroImage.findById(id);

      if (!HeroImage) {
        return next(ErrorHandler(404, "heroImage id not found"));
      }
      res.status(200).json({
        success: true,
        heroImage,
      });
    } catch (error) {
      next(error);
    }
  }

  const UpdateHeroImage = async (req, res, next) => {
    try {
      const { id } = req.params;
       
      const heroImage = req.file; 
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(ErrorHandler(400, "Invalid section ID"));
      }
  
      const getHeroImage = await HeroImage.findById(id);

      if (!getHeroImage) {
        return next(ErrorHandler(404, "Section not found"));
      }
  
      if (heroImage) {

        await cloudinary.uploader.destroy(getHeroImage.imageUrl.public_id);
  
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(heroImage.path, {
          folder: "MyHome2U/HeroImage",
        });
  
        // Update section image
        getHeroImage.imageUrl = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }
  
      const updatedHeroImage = await getHeroImage.save(); 
  
      res.status(200).json({
        success: true,
        message: "Hero updated successfully",
        updatedHeroImage
      });
  
    } catch (error) {
      next(error);
    }
  };

  const DeleteHeroImage = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(ErrorHandler(400, "Invalid section ID"));
      }
  
      const getHeroImage = await HeroImage.findById(id);
  
      if (!getHeroImage) {
        return next(ErrorHandler(404, "HeroImage not found"));
      }
  
      await cloudinary.uploader.destroy(getHeroImage.imageUrl.public_id);
  
      await HeroImage.deleteOne({ _id: id });
  
      res.status(200).json({
        success: true,
        message: "HeroImage deleted successfully",
      });
  
    } catch (error) {
      next(error);
    }
  };
  

module.exports = {
  AdHeroImage,
  getHeroImage,
  GetSingleHeroImage,
  UpdateHeroImage,
  DeleteHeroImage
};
