const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkAdmin = require("../middleware/web/checkAdmin");
const storeController = require("../controllers/storeController");

// Định nghĩa route để lấy danh sách cửa hàng
router.get("/listStore", storeController.getStores);
router.post("/addStore", authMiddleware, checkAdmin, storeController.addStore);
router.put(
  "/updateStore/:id",
  authMiddleware,
  checkAdmin,
  storeController.updateStore
);
router.delete(
  "/deleteStore/:id",
  authMiddleware,
  checkAdmin,
  storeController.deleteStore
);

module.exports = router;
