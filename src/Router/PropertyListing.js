const express = require("express");
const { AddProperty, GetAllProperty,DeleteSingleProperty,GetSingleProperty, UpdateSingleProperty} = require("../Controller/PropertyListing.js");

const upload = require("../MiddleWare/multer");

const Router = express.Router();

Router.post("/addproperty",upload.single("image"), AddProperty);
Router.get("/getallproperty",GetAllProperty);
Router.delete("/deleteproperty/:id", DeleteSingleProperty);
Router.get("/getsingleproperty/:id", GetSingleProperty);
Router.put("/updatesingleproperty/:id",upload.single("image"), UpdateSingleProperty);

module.exports = Router;
