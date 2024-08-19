const express = require("express");
const { 
    AdHeroImage,
    getHeroImage,
    GetSingleHeroImage,
    UpdateHeroImage,
    DeleteHeroImage
} = require("../Controller/HeroImage");

const upload = require("../MiddleWare/multer");

const Router = express.Router();

Router.post("/AddHeroImage",upload.single("heroImage"), AdHeroImage);
Router.get("/AllHeroImages",    getHeroImage);
Router.get("/SingleHeroImage/:id", GetSingleHeroImage);
Router.put("/UpdateHeroImage/:id",upload.single("heroImage"), UpdateHeroImage);
Router.delete("/DeleteHeroImage/:id",DeleteHeroImage);

module.exports = Router;

