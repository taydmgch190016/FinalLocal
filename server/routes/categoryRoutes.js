const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories");

// Route to get all categories
router.get("/listCategory", categoriesController.getAllCategories);

module.exports = router;
