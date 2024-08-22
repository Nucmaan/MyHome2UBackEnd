const AboutUs = require("../Model/AboutUs");
const ErrorHandler = require("../Utils/error");
const cloudinary = require("../MiddleWare/Cloudinary.js");
const { default: mongoose } = require("mongoose");
const fs = require('fs');


const AddSection = async (req, res, next) => {
  try {
    const { sectionTitle, sectionContent } = req.body;
    const sectionImage = req.file;

    if (!sectionTitle || !sectionContent ) {
      return next(ErrorHandler(400, "All fields are required"));
    }

    if (!sectionImage) {
      return next(ErrorHandler(400, "Image is required"));
    }

    const result = await cloudinary.uploader.upload(sectionImage.path, {
      folder: "MyHome2U/AboutUsPage",
    });

    if(!result) {
      fs.unlink(sectionImage.path);
      return next(ErrorHandler(500, "Failed to upload image"));
    }

    fs.unlinkSync(sectionImage.path);
    

    const newSection = await AboutUs.create({
      sectionTitle,
      sectionContent,
      sectionImage: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "Section added successfully",
      section: newSection,
    });
  } catch (error) {
    next(error);
  }
};

const GetSections = async (req, res, next) => {
    try {
      const sections = await AboutUs.find({});
      res.status(200).json({
        success: true,
        sections,
      });
    } catch (error) {
      next(error);
    }
  };

  const GetSingleSection = async (req, res, next) => {
    try {
      const { id } = req.params;
      const section = await AboutUs.findById(id);
      if (!section) {
        return next(ErrorHandler(404, "Section not found"));
      }
      res.status(200).json({
        success: true,
        section,
      });
    } catch (error) {
      next(error);
    }
  }

  const deleteSection = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Validate the provided ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(ErrorHandler(400, "Invalid section ID"));
      }
  
      // Find the section by ID
      const section = await AboutUs.findById(id);
      if (!section) {
        return next(ErrorHandler(404, "Section not found"));
      }
  
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(section.sectionImage.public_id);
  
      // Delete the section from the database
      await section.deleteOne(); 
  
      res.status(200).json({
        success: true,
        message: "Section deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  const UpdateSection = async (req, res, next) => {
    try {
    
      const { id } = req.params;
      const { sectionTitle, sectionContent } = req.body; 
      const sectionImage = req.file; 
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(ErrorHandler(400, "Invalid section ID"));
      }
  
      const section = await AboutUs.findById(id);
      if (!section) {
        return next(ErrorHandler(404, "Section not found"));
      }
  
      // Handle image update
      if (sectionImage) {
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(section.sectionImage.public_id);
  
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(sectionImage.path, {
          folder: "MyHome2U/AboutUsPage",
        });
  
        // Update section image
        section.sectionImage = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }
  
      // Update other fields
      if (sectionTitle) section.sectionTitle = sectionTitle;
      if (sectionContent) section.sectionContent = sectionContent;
  
      // Save the updated section
      const updatedSection = await section.save(); 
  
      res.status(200).json({
        success: true,
        message: "Section updated successfully",
        section: updatedSection,
      });
  
    } catch (error) {
      next(error);
    }
  };
  
  

module.exports = {
  AddSection,
  GetSections,
  GetSingleSection,
  deleteSection,
  UpdateSection
};
