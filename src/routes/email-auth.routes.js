const express = require("express")
const { authEmail } = require("../middlewares/auth-email")
const router = express.Router()

router.route("/")
.post(authEmail)

module.exports = router