const ErrorHandler = require("../Utils/error");
const Booking = require("../Model/Booking.js");
const { default: mongoose } = require("mongoose");
const User = require("../Model/User.js");
const Property = require("../Model/Property.js")


const AddNewBooking = async (req, res, next) => {
  try {
    const { property, user, visitingDate } = req.body;

    if (!(property && user && visitingDate)) {
      return next(ErrorHandler(400, "All fields are required"));
    }

    const newBooking = new Booking({
      property,
      user,
      visitingDate
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "New booking added successfully",
      booking: newBooking,
    });

  } catch (error) {
    next(error);
  }
};

const AllBookings = async (req, res, next) => {
    try {
      const bookings = await Booking.find({}).populate('user').populate('property');;
      
      if (bookings.length === 0) {
        return next(ErrorHandler(400, "No bookings found"));
      }
  
      res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error); // Log the error for debugging
      next(error);
    }
  };

  const getUserBookings = async (req, res, next) => {
    const userId = req.params.id; // Use the route parameter name
  
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(ErrorHandler(400, "Invalid User ID format"));
      }
  
      const bookings = await Booking.find({ user: userId })
        .populate({
          path: 'property',
          populate: {
            path: 'owner', // Populate owner details in property
            model: 'User', // Ensure the model name is specified
            select: 'name phone' // Adjust fields to include from the owner as needed
          }
        })
        .populate('user', 'name email avatar'); // Ensure only necessary fields are populated
  
      if (bookings.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No bookings found for this user",
        });
      }
  
      res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      next(ErrorHandler(500, "Server error"));
    }
  };

  const GetAgentBooking = async (req, res, next) => {
    const { agentId } = req.params; // Use the route parameter name
    try {
      if (!mongoose.Types.ObjectId.isValid(agentId)) {
        return next(ErrorHandler(400, "Invalid Agent ID format"));
      }
  
      // Find properties where the owner is the agent
      const properties = await Property.find({ owner: agentId });
  
      if (properties.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No properties found for this agent",
        });
      }
  
      // Extract property IDs
      const propertyIds = properties.map(property => property._id);
  
      // Find bookings for the agent's properties
      const agentBookings = await Booking.find({ property: { $in: propertyIds } })
        .populate('user', 'name phone') // Populate user with name and phone only
        .populate('property');
  
      if (agentBookings.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No bookings found for this agent's properties",
        });
      }
  
      res.status(200).json({
        success: true,
        count: agentBookings.length,
        agentBookings,
      });
    } catch (error) {
      next(error);
    }
  };

  const DeleteBookings = async (req, res, next) => {
    const bookingId = req.params.bookingId; 
  
    try {
      
      const deletedBooking = await Booking.findByIdAndDelete(bookingId);
  
      if (!deletedBooking) {
        return next(ErrorHandler(404, "Booking not found or already deleted"));
      }
  
      res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
        booking: deletedBooking
      });
      
    } catch (error) {
      next(error);
    }
  };

  const GetSingleBooking  = async(req, res, next) =>{
            const bookingId = req.params.bookingId; 
           try {
             const booking = await Booking.findById(bookingId);
             
             if (!booking) {
                return next(ErrorHandler(404, "Booking not found"));
             }
             
             res.status(200).json({
                success: true,
                booking
             });     
           } catch (error) {
            next(error);
           }
  };

  const UpdateBooking = async (req, res, next) => {
    const { id } = req.params; 
  
    try {
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(ErrorHandler(400, "Invalid Booking ID format"));
      }
  
      const { status } = req.body;
  
      const booking = await Booking.findById(id);
      if (!booking) {
        return next(ErrorHandler(404, "Booking not found"));
      }
  
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );
  
      if (!updatedBooking) {
        return next(ErrorHandler(404, "Cannot update booking"));
      }
  
      res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  };

  const getAllDetailSingleBookings = async (req, res, next) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findById(id)
        .populate({
          path: 'property',
          populate: {
            path: 'owner',
          },
        })
        .populate('user');
  
      if (!booking) {
        return next(ErrorHandler(404, "Booking not found"));
      }
  
      res.status(200).json({
        success: true,
        booking,
      });
    } catch (error) {
      next(error);
    }
  };

  const DeleteBooking = async (req, res, next) => {
    const { bookingId } = req.params; // Adjust to the parameter name used in your route
    
    try {
      // Check if the bookingId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return next(ErrorHandler(400, "Invalid Booking ID format"));
      }
      
      // Find and delete the booking
      const deletedBooking = await Booking.findByIdAndDelete(bookingId);
      
      // Check if the booking was found and deleted
      if (!deletedBooking) {
        return next(ErrorHandler(404, "Booking not found or already deleted"));
      }
      
      // Return success response
      res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
        booking: deletedBooking,
      });
      
    } catch (error) {
      // Pass any errors to the error handler
      next(error);
    }
  };
  
    
module.exports = {
  AddNewBooking,
  AllBookings,
  getUserBookings,
  DeleteBookings,
  GetAgentBooking,
  GetSingleBooking,
  UpdateBooking,
  getAllDetailSingleBookings,
  DeleteBooking
};
