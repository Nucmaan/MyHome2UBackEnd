// controllers/Blog.js
const Blog = require('../Model/Blog');
const cloudinary = require('../MiddleWare/Cloudinary');
const ErrorHandler = require('../Utils/error');
const { default: mongoose } = require('mongoose');

const createPost = async (req, res, next) => {
  try {
    const { title, shortInfo, content, author, roll } = req.body;

    if (!(title && shortInfo && content && author && roll)) {
      return next(ErrorHandler(400, 'All fields are required'));
    }

    const image = req.file;
    if (!image){
        return next(ErrorHandler(400, 'Image is required'));
    }

    const result = await cloudinary.uploader.upload(image.path,{
      folder: 'MyHome2U/blogs',
    });

    const imageUrl = result.secure_url;
    const ImageId = result.public_id;

    const Post = await Blog.create({
      title,
      shortInfo,
      content,
      author,
      image : {
        public_id : ImageId,
        url : imageUrl
      },
      roll,
    });
    res.status(200).json({
        success: true,
        message: 'Post created successfully',
        Post
    });

  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Blog.find({});
        if (posts.length === 0) {
            return next(ErrorHandler(400, 'No posts found'));
        }
        res.status(200).json({
            success: true,
            count: posts.length,
            posts,
        });

    } catch (error) {
        next(error);
    }
};

const getSinglePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(ErrorHandler(400, 'Invalid post ID'));
        }

        const post = await Blog.findById(id);

        if (!post) {
            return next(ErrorHandler(404, 'Post not found'));
        }

        res.status(200).json({
            success: true,
            post,
        });
  
    } catch (error) {
        next(error);
    }
}

const deletePost = async(req,res,next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(ErrorHandler(400, 'Invalid post ID'));
        }

        const post = await Blog.findByIdAndDelete(id);
        
        if (!post) {
            return next(ErrorHandler(404, 'Post not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
        
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(ErrorHandler(400, 'Invalid post ID'));
        }

        // Find the existing post
        const post = await Blog.findById(id);

        if (!post) {
            return next(ErrorHandler(404, 'Post not found'));
        }

        // Log existing post data
        console.log('Post before update:', post);

        const { title, shortInfo, content, author, roll } = req.body;
        
        // Update fields if they are provided
        if (title) post.title = title;
        if (shortInfo) post.shortInfo = shortInfo;
        if (content) post.content = content;
        if (author) post.author = author;
        if (roll) post.roll = roll;

        // Handle image update
        if (req.file) {
            console.log('New image file:', req.file);

            // Delete the old image from Cloudinary
            if (post.image && post.image.public_id) {
                await cloudinary.uploader.destroy(post.image.public_id);
            }

            // Upload the new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'MyHome2U/blogs',
            });

            console.log('Cloudinary result:', result);

            // Update the post's image details
            post.image = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        // Save the updated post
        const updatedPost = await post.save();

        console.log('Post after update:', updatedPost);

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            post: updatedPost,
        });

    } catch (error) {
        next(error);
    }
};



module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  updatePost
};
