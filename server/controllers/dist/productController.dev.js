"use strict";

var Product = require("../models/Product");

exports.getProductsByStoreId = function _callee(req, res) {
  var storeId, products;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          storeId = req.params.storeId;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Product.find({
            storeId: storeId
          }));

        case 4:
          products = _context.sent;
          res.json(products);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: _context.t0.message
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.getProductsByStoreAndCategory = function _callee2(req, res) {
  var _req$params, storeId, categoryId, products;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$params = req.params, storeId = _req$params.storeId, categoryId = _req$params.categoryId;
          _context2.prev = 1;

          if (!categoryId) {
            _context2.next = 8;
            break;
          }

          _context2.next = 5;
          return regeneratorRuntime.awrap(Product.find({
            storeId: storeId,
            categoryId: categoryId
          }));

        case 5:
          products = _context2.sent;
          _context2.next = 11;
          break;

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(Product.find({
            storeId: storeId
          }));

        case 10:
          products = _context2.sent;

        case 11:
          res.status(200).json(products);
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: "Error fetching products",
            error: _context2.t0.message
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 14]]);
};

exports.searchProducts = function _callee3(req, res) {
  var name, products;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          name = req.query.name;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Product.find({
            name: {
              $regex: name,
              $options: 'i'
            }
          }));

        case 4:
          products = _context3.sent;
          res.json(products);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error('Error searching products:', _context3.t0.message);
          res.status(500).json({
            error: 'Server error'
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};