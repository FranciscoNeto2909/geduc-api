const express = require("express");
const blogController = require("../controllers/blog-controller");

const router = express.Router();

router.route("/").get(blogController.all).post(blogController.create);
router
  .route("/:id")
  .get(blogController.one)
  .put(blogController.update)
  .delete(blogController.delete);

module.exports = router;
