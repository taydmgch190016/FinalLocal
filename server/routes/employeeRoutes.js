const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/web/employee");
const authMiddleware = require("../middleware/authMiddleware");
const checkAdmin = require("../middleware/web/checkAdmin");

// Route to get all categories
router.get("/listEmployee", employeeController.getAllEmployees);
router.post(
  "/addEmployee",
  authMiddleware,
  checkAdmin,
  employeeController.createEmployee
);
router.put(
  "/updateEmployee/:id",
  authMiddleware,
  checkAdmin,
  employeeController.updateEmployee
);
router.delete(
  "/deleteEmployee/:id",
  authMiddleware,
  checkAdmin,
  employeeController.deleteEmployee
);

module.exports = router;
