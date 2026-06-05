import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const image = await uploadOnCloudinary(imageLocalPath);

    const post = await Post.create({
      image: image.url,
      caption,
      owner: req.user._id,
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(posts);
};





export { createPost, getAllPosts };