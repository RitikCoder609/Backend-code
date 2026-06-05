import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Comment } from "../models/comment.model.js";

const postOwnerFields = "username fullName avatar";

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    if (!caption?.trim()) {
      return res.status(400).json({
        message: "Caption is required",
      });
    }

    const image = await uploadOnCloudinary(imageLocalPath);

    const post = await Post.create({
      image: image.url,
      caption,
      owner: req.user._id,
    });

    const createdPost = await Post.findById(post._id).populate(
      "owner",
      postOwnerFields
    );

    return res.status(201).json(createdPost);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("owner", postOwnerFields)
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ owner: { $ne: req.user._id } })
      .populate("owner", postOwnerFields)
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ owner: req.user._id })
      .populate("owner", postOwnerFields)
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await Post.findById(postId).populate(
      "owner",
      "username fullName avatar"
    );

    return res.status(200).json({
      post: updatedPost,
      liked: !alreadyLiked,
      likesCount: updatedPost.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      content,
      owner: req.user._id,
      post: postId,
    });

    const createdComment = await Comment.findById(comment._id).populate(
      "owner",
      "username fullName avatar"
    );

    return res.status(201).json(createdComment);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("owner", "username fullName avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can delete only your comment",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully",
      commentId,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export {
  createPost,
  getAllPosts,
  getFeedPosts,
  getMyPosts,
  toggleLike,
  createComment,
  getPostComments,
  deleteComment,
};
