"use strict";

var express = require("express");

var router = express.Router();

var Order = require("../../models/Order");

var Product = require("../../models/Product");

var Customer = require("../../models/Customer");

var nodemailer = require('nodemailer');

var createOrder = function createOrder(req, res) {
  var _req$body, orderItems, shippingAddress, totalPrice, user, storeId, paymentMethod, productIds, products, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, newOrder, savedOrder, customer, amount, emailCustomer, transporter, content, mainOptions;

  return regeneratorRuntime.async(function createOrder$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, orderItems = _req$body.orderItems, shippingAddress = _req$body.shippingAddress, totalPrice = _req$body.totalPrice, user = _req$body.user, storeId = _req$body.storeId, paymentMethod = _req$body.paymentMethod;
          productIds = orderItems.map(function (item) {
            return item.product;
          });
          _context2.next = 5;
          return regeneratorRuntime.awrap(Product.find({
            _id: {
              $in: productIds
            }
          }));

        case 5:
          products = _context2.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 9;

          _loop = function _loop() {
            var orderItem, product;
            return regeneratorRuntime.async(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    orderItem = _step.value;
                    product = products.find(function (p) {
                      return p._id.toString() === orderItem.product;
                    });

                    if (!product) {
                      _context.next = 6;
                      break;
                    }

                    // Deduct the quantity of the product
                    product.quantity -= orderItem.quanlity; // Save the updated product

                    _context.next = 6;
                    return regeneratorRuntime.awrap(product.save());

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          _iterator = orderItems[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 18;
            break;
          }

          _context2.next = 15;
          return regeneratorRuntime.awrap(_loop());

        case 15:
          _iteratorNormalCompletion = true;
          _context2.next = 12;
          break;

        case 18:
          _context2.next = 24;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 24:
          _context2.prev = 24;
          _context2.prev = 25;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 27:
          _context2.prev = 27;

          if (!_didIteratorError) {
            _context2.next = 30;
            break;
          }

          throw _iteratorError;

        case 30:
          return _context2.finish(27);

        case 31:
          return _context2.finish(24);

        case 32:
          newOrder = new Order({
            orderItems: orderItems,
            shippingAddress: shippingAddress,
            totalPrice: totalPrice,
            user: user,
            storeId: storeId,
            paymentMethod: paymentMethod
          });
          _context2.next = 35;
          return regeneratorRuntime.awrap(newOrder.save());

        case 35:
          savedOrder = _context2.sent;
          _context2.next = 38;
          return regeneratorRuntime.awrap(Customer.findById(user));

        case 38:
          customer = _context2.sent;
          amount = newOrder.totalPrice;
          emailCustomer = customer.email;
          transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "testnodemailer150601@gmail.com",
              pass: "lmiu qgdk kbux hwkx"
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          content = "";
          content += "\n                            <div style=\"padding: 10px; background-color: #003375\">\n                                <div style=\"padding: 10px; background-color: white;\">    \n                        ";
          content += '<h4 style="color: #0085ff"> New Order! </h4> <hr>';
          content += '<span style="color: black">Hello: ' + customer.username.toString() + "!</span><br>";
          content += '<span style="color: black"> You have a new order from Minh Tay Store! ';
          "</span><br>";
          content += '<span style="color: black"> Total amount: ' + amount + "$</span><br>";
          content += '<span style="color: black"> Payment method: ' + newOrder.paymentMethod + ".</span><br>";
          content += "</div> </div>";
          mainOptions = {
            from: "Final Store",
            to: emailCustomer,
            subject: "New Order! ",
            text: "abc",
            html: content
          };
          transporter.sendMail(mainOptions, function (err, info) {
            if (err) console.error("Error: ", err);else console.log("Message sent: ", info.response);
          });
          res.status(201).json(savedOrder);
          _context2.next = 60;
          break;

        case 56:
          _context2.prev = 56;
          _context2.t1 = _context2["catch"](0);
          console.error("Error creating order:", _context2.t1.message);
          res.status(500).json({
            error: "Server error"
          });

        case 60:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 56], [9, 20, 24, 32], [25,, 27, 31]]);
};

var getOrders = function getOrders(req, res) {
  var userID, orders;
  return regeneratorRuntime.async(function getOrders$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userID = req.query.userID;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Order.find({
            user: userID
          }));

        case 4:
          orders = _context3.sent;
          res.json(orders);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error('Error fetching orders:', _context3.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var orderDetail = function orderDetail(req, res) {
  var order;
  return regeneratorRuntime.async(function orderDetail$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Order.findById(req.params.id));

        case 3:
          order = _context4.sent;

          if (order) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Order not found'
          }));

        case 6:
          res.json(order);
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error('Error fetching order detail:', _context4.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  createOrder: createOrder,
  getOrders: getOrders,
  orderDetail: orderDetail
};