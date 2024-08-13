const express = require("express");
const {
    createSocialMediaLink,
    getAllSocialMediaLinks,
    updateSocialMediaLink,
    deleteSocialMediaLink
} = require("../Controller/SocialMedia");

const Router = express.Router();

Router.post("/AddLinks", createSocialMediaLink);
Router.get("/AllLinks", getAllSocialMediaLinks);
Router.put("/UpdateLinks", updateSocialMediaLink);
Router.delete("/DeleteLinks", deleteSocialMediaLink);

module.exports = Router;
