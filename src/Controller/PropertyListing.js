const cloudinary = require("../MiddleWare/Cloudinary.js");
const Property = require("../Model/Property.js");
const ErrorHandler = require("../Utils/error.js");

const AddProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      address,
      city,
      bedrooms,
      bathrooms,
      price,
      deposit,
      houseType,
      parking,
      image,
      owner,
      status,
    } = req.body;

    if (
      !(title && description && address && city && bedrooms && bathrooms && price && deposit && houseType && parking && image && owner && status )
    ) {
      return next(ErrorHandler(400, "Please provide all required fields"));
    }
  
    const result = await cloudinary.uploader.upload(image, {
      folder: "MyHome2U/propertyListing",
    });

    const property = new Property({
      title,
      description,
      address,
      city,
      bedrooms,
      bathrooms,
      price,
      deposit,
      houseType,
      parking,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      owner,
      status,
    });

    await property.save();

    return res.status(201).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

const GetAllProperty = async (req, res, next) => {
  try {
    const properties = await Property.find({});
    if (!properties) {
      return next(new ErrorHandler(400, "No property found"));
    }
    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

const DeleteSingleProperty = async (req, res, next) => {
  const { id } = req.params;

  try {
    const property = await Property.findById(id);

    if (!property) {
      return next(ErrorHandler(400, `Couldn't find property with this ID: ${id}`));
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(property.image.public_id);

    // Delete the property from the database
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return next(ErrorHandler(400, `Couldn't delete property with this ID: ${id}`));
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
      deletedProperty
    });
    
  } catch (error) {
    next(error);
  }
};

const GetSingleProperty = async (req, res, next) => {
  // Get the property ID from the request parameters
  const { id } = req.params;
  try {

    const property = await Property.findById(id);

    if (!property) {
      return next(ErrorHandler(404, `Property with ID: ${id} not found`));
    }

    res.status(200).json({
      success: true,
      property,
    });

  } catch (error) {
    next(error);
  }
};

const UpdateSingleProperty = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    address,
    city,
    bedrooms,
    bathrooms,
    price,
    deposit,
    houseType,
    parking,
    image,
    status,
  } = req.body;

  try {
    let property = await Property.findById(id);

    if (!property) {
      return next(ErrorHandler(404, `Property with ID: ${id} not found`));
    }

    if (image && image !== property.image.url) {
      if (property.image && property.image.public_id) {
        await cloudinary.uploader.destroy(property.image.public_id);
      }
      const result = await cloudinary.uploader.upload(image, {
        folder: "MyHome2U/propertyListing",
      });
      property.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }


    // Update the property with the new values
    property.title = title || property.title;
    property.description = description || property.description;
    property.address = address || property.address;
    property.city = city || property.city;
    property.bedrooms = bedrooms || property.bedrooms;
    property.bathrooms = bathrooms || property.bathrooms;
    property.price = price || property.price;
    property.deposit = deposit || property.deposit;
    property.houseType = houseType || property.houseType;
    property.parking = parking || property.parking;
    property.status = status || property.status;

    await property.save();

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddProperty,
  GetAllProperty,
  DeleteSingleProperty,
  GetSingleProperty,
  UpdateSingleProperty,
};
