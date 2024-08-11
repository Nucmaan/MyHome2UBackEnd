const express = require("express");
const { AddProperty, GetAllProperty,DeleteSingleProperty,GetSingleProperty, UpdateSingleProperty} = require("../Controller/PropertyListing.js");

const Router = express.Router();

Router.post("/addproperty", AddProperty);
Router.get("/getallproperty",GetAllProperty);
Router.delete("/deleteproperty/:id", DeleteSingleProperty);
Router.get("/getsingleproperty/:id", GetSingleProperty);
Router.put("/updatesingleproperty/:id", UpdateSingleProperty);

module.exports = Router;
