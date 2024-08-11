const express = require("express");
const {
    AddNewBooking,
    getAllBills,
    getSingleBill,
    updateBill,
    getUserBills,
    updateUserBills
} = require("../Controller/Bills");

const Router = express.Router();

Router.post("/AddBill", AddNewBooking);
Router.get("/GetAllBills", getAllBills);
Router.get("/GetSingleBill/:id",getSingleBill);
Router.put("/updateBill/:id",updateBill);
Router.get("/getUserBills/:id",getUserBills);
Router.put("/updateUserBill/:id",updateUserBills);

module.exports = Router;
