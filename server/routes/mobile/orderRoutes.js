const express = require("express");
const router = express.Router();
const order = require("../../controllers/mobile/orderController");

router.get("/getTopProducts", order.getTopProducts);
router.get("/revenueStatistics", order.revenueStatistics);
router.get("/listOrders", order.getAllOrders);
router.post("/confirmDelivery/:id", order.confirmDelivery);
router.post("/create", order.createOrder);
router.get("/orderByUserId", order.getOrders);
router.get("/:id", order.orderDetail);
module.exports = router;
