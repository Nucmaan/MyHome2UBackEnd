const express = require("express");

const { createPost, getAllPosts, getSinglePost, deletePost, updatePost} = require("../Controller/Blog");

const upload = require("../MiddleWare/multer");

const Router = express.Router();

Router.post("/AddPost", upload.single("image"), createPost);
Router.get("/AllPosts", getAllPosts);
Router.get("/GetSinglePost/:id", getSinglePost);
Router.delete("/DeletePost/:id",deletePost);
Router.put("/UpdatePost/:id",updatePost);

module.exports = Router;
