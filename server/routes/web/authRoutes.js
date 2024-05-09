const express = require("express");
const router = express.Router();
const authController = require("../../controllers/web/authController");
const authMiddleware = require("../../middleware/authMiddleware");
const checkAdmin = require("../../middleware/web/checkAdmin");

// Route đăng nhập
router.post("/webLogin", authController.webLogin);
router.post(
  "/admin/employeeRegister",
  authMiddleware,
  checkAdmin,
  authController.registerEmployee
);
// Đăng xuất
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
