const express = require("express");
const { AddSection, GetSections, GetSingleSection, deleteSection, UpdateSection } = require("../Controller/AboutUs");

const upload = require("../MiddleWare/multer");

const Router = express.Router();

Router.post("/AddSection",upload.single("sectionImage"), AddSection);
Router.get("/AllSections",GetSections);
Router.get("/SingleSection/:id", GetSingleSection);
Router.delete("/DeleteSection/:id", deleteSection);
Router.put("/UpdateSection/:id",upload.single("sectionImage"), UpdateSection);

module.exports = Router;

