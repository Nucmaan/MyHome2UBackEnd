const express = require("express");
const {
    AddNewBooking,
    AllBookings,
    getUserBookings,
    DeleteBookings,
    GetAgentBooking,
    GetSingleBooking,
    UpdateBooking,
    getAllDetailSingleBookings,
    DeleteBooking
} = require("../Controller/Booking.js");

const Router = express.Router();

Router.post("/AddNewBooking", AddNewBooking);
Router.get("/GetAllBookings", AllBookings);
Router.get("/GetUserBookings/:id", getUserBookings);
Router.delete('/DeleteBooking/:bookingId', DeleteBookings);
Router.get("/GetAgentBookings/:agentId", GetAgentBooking);
Router.get("/getBooking/:bookingId",GetSingleBooking);
Router.put("/updateBooking/:id", UpdateBooking);
Router.get("/singleBookingInfo/:id",getAllDetailSingleBookings);
Router.delete("/DeleteSingleBooking/:bookingId",DeleteBooking);


module.exports = Router;

