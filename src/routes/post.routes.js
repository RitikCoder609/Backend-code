import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPost,
  getAllPosts,
  getFeedPosts,
  getMyPosts,
  toggleLike,
  createComment,
  getPostComments,
  deleteComment,
} from "../controllers/post.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("image"), createPost);
router.route("/feed").get(verifyJWT, getFeedPosts);
router.route("/me").get(verifyJWT, getMyPosts);
router.route("/").get(getAllPosts);
router.route("/:postId/like").post(verifyJWT, toggleLike);
router.route("/:postId/comments").post(verifyJWT, createComment);
router.route("/:postId/comments").get(verifyJWT, getPostComments);
router.route("/comments/:commentId").delete(verifyJWT, deleteComment);
export default router;
