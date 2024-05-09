"use strict";

var express = require("express");

var router = express.Router();

var order = require("../../controllers/mobile/orderController");

router.post("/create", order.createOrder);
router.get("/orderByUserId", order.getOrders);
router.get("/:id", order.orderDetail);
module.exports = router;