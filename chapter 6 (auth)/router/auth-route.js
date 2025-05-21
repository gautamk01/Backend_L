const express = require("express");
const {
  registerUser,
  login_controller,
} = require("../controller/auth-controller");
const router = express.Router();

//all router are related to authentication and auth
router.post("/register", registerUser);
router.post("/login", login_controller);

module.exports = router;
