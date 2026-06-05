import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost, getAllPosts } from "../controllers/post.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("image"), createPost);

router.route("/").get(getAllPosts);

export default router;
