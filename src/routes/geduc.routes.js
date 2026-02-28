const express = require("express");
const geducController = require("../controllers/geduc-controller");
const { authMiddleware } = require("../middlewares/getUserId");

const router = express.Router();

router.route("/").get(geducController.one);
router.route("/create").post(geducController.create)
router.route("/update").put(authMiddleware, geducController.update);

module.exports = router;
