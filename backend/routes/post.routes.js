const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const post = require("../controllers/post.controllers");
const comment = require("../controllers/comment.controllers");
const like = require("../controllers/like.controllers");

router.get("/", auth, post.getAllPosts);
router.get("/:postId", auth, post.getOnePost);
router.post("/", auth,  multer.array('content', 50), post.createPost);
router.put("/:postId", auth, multer.array('content', 50), post.modifyPost);
router.delete("/:postId", auth, post.deletePost);

router.get("/comment/:postId", auth, comment.getAllComments);
router.post("/comment/:postId", auth, comment.createComment);
router.put("/comment/:commentId", auth, comment.modifyComment);
router.delete("/comment/:commentId", auth, comment.deleteComment);

router.get("/likes/:postId", auth, like.getAllLikes);
router.post("/like/:postId", auth, like.likePost);

module.exports = router;