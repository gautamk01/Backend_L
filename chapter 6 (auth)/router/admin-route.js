const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminmiddleware = require("../middleware/admin-middleware");
const router = express.Router();

router.get("/welcome_admin", authMiddleware, adminmiddleware, (req, res) => {
  res.json({
    messsage: "welcome to the admin page ",
  });
});

module.exports = router;
