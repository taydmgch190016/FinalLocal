"use strict";

// server/routes/productRoutes.js
var express = require("express");

var router = express.Router();

var productController = require("../controllers/productController"); // Route để lấy tất cả sản phẩm của một cửa hàng theo storeId


router.get("/:storeId", productController.getProductsByStoreId);
router.get("/:storeId/:categoryId?", productController.getProductsByStoreAndCategory);
router.get("/:storeId/search", productController.searchProducts);
module.exports = router;