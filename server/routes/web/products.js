const express = require("express");
const router = express.Router();
const uploadImages = require("../../middleware/uploadImages");
const { addProduct } = require("./../../controllers/web/products");
const authMiddleware = require("../../middleware/authMiddleware");
const checkEmployee = require("../../middleware/web/checkEmployee");
const productController = require("../../controllers/web/products");

// Route để xử lý yêu cầu thêm sản phẩm, sử dụng Multer
router.get("/listProduct", productController.getAllProducts);
router.post(
  "/addProduct",
  authMiddleware,
  checkEmployee,
  uploadImages.single("image"),
  productController.addProduct
);
router.put(
  "/updateProduct/:id",
  authMiddleware,
  checkEmployee,
  uploadImages.single("image"),
  productController.updateProduct
);

router.delete(
  "/deleteProduct/:id",
  authMiddleware,
  checkEmployee,
  productController.deleteProduct
);

module.exports = router;
