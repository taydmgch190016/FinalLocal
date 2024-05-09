const express = require("express");
const router = express.Router();
const customer = require("../../controllers/mobile/customerController");

router.get("/:id", customer.getCustomer);
module.exports = router;