const express = require("express");
const router = express.Router();
const clientAuth = require("../../controllers/mobile/clientAuth");

// Route để xử lý yêu cầu đăng ký từ khách hàng
router.post("/register", clientAuth.clientRegister);
router.post("/login", clientAuth.clientLogin);
module.exports = router;
