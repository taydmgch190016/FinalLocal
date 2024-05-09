"use strict";

var express = require("express");

var router = express.Router();

var customer = require("../../controllers/mobile/customerController");

router.get("/:id", customer.getCustomer);
module.exports = router;