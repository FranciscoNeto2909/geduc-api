const express = require("express");
const tasksController = require("../controllers/taskController");

const router = express.Router();

router.route("/").get(tasksController.all).post(tasksController.create);
router
  .route("/:id")
  .get(tasksController.one)
  .put(tasksController.update)
  .delete(tasksController.delete);

module.exports = router;
