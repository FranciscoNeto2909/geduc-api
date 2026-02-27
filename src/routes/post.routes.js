const express = require("express");
const multer = require("multer");
const path = require("path");
const postController = require("../controllers/post-controller");
const { authMiddleware } = require("../middlewares/getUserId");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/images/posts");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router
  .route("/")
  .get(postController.all)
  .post(upload.single("image"), postController.create); // 👈 AQUI

router
  .route("/:id")
  .get(postController.one)
  .put(authMiddleware, upload.single("image"), postController.update)
  .delete(authMiddleware, postController.delete);

module.exports = router;
