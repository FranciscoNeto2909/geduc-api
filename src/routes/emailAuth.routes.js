const express = require("express")
const { authEmail } = require("../middlewares/authEmail")
const router = express.Router()

router.route("/")
.post(authEmail)

module.exports = router