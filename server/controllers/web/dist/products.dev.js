"use strict";

var multer = require("multer");

var jwt = require("jsonwebtoken");

var Employee = require("../../models/Employee");

var cloudinary = require("cloudinary").v2;

var _require = require("multer-storage-cloudinary"),
    CloudinaryStorage = _require.CloudinaryStorage;

var Product = require("../../models/Product");

var getAllProducts = function getAllProducts(req, res) {
  var products;
  return regeneratorRuntime.async(function getAllProducts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Product.find());

        case 3:
          products = _context.sent;
          res.json(products);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Hàm controller để thêm sản phẩm


var addProduct = function addProduct(req, res) {
  var token, decodedToken, loggedInEmployeeId, loggedInEmployee, newProduct, savedProduct;
  return regeneratorRuntime.async(function addProduct$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Lấy thông tin của nhân viên từ JWT token
          token = req.headers.authorization.split(" ")[1];
          decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          loggedInEmployeeId = decodedToken.userId;
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Employee.findById(loggedInEmployeeId));

        case 6:
          loggedInEmployee = _context2.sent;

          if (loggedInEmployee) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Employee not found"
          }));

        case 9:
          // Tạo sản phẩm mới và gán storeId từ nhân viên đăng nhập
          newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            imageURL: req.file ? req.file.path : "",
            // Lấy đường dẫn ảnh từ multer
            storeId: loggedInEmployee.storeId,
            // Gán storeId của nhân viên
            categoryId: req.body.categoryId
          }); // Lưu sản phẩm vào cơ sở dữ liệu

          _context2.next = 12;
          return regeneratorRuntime.awrap(newProduct.save());

        case 12:
          savedProduct = _context2.sent;
          // Trả về thông tin của sản phẩm đã được lưu
          res.status(201).json(savedProduct);
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](3);
          // Xử lý lỗi nếu có
          res.status(500).json({
            message: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 16]]);
}; // delete product


var deleteProduct = function deleteProduct(req, res) {
  var token, decodedToken, loggedInEmployeeId, productId, loggedInEmployee, product;
  return regeneratorRuntime.async(function deleteProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Lấy thông tin của nhân viên từ JWT token
          token = req.headers.authorization.split(" ")[1];
          decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          loggedInEmployeeId = decodedToken.userId;
          productId = req.params.id;
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Employee.findById(loggedInEmployeeId));

        case 7:
          loggedInEmployee = _context3.sent;

          if (loggedInEmployee) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Employee not found"
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 12:
          product = _context3.sent;

          if (product) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Product not found"
          }));

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(product.deleteOne());

        case 17:
          res.json({
            message: "Product deleted successfully"
          });
          _context3.next = 23;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](4);
          res.status(500).json({
            message: _context3.t0.message
          });

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 20]]);
}; // update product


var updateProduct = function updateProduct(req, res) {
  var token, decodedToken, loggedInEmployeeId, productId, loggedInEmployee, product, updatedProduct;
  return regeneratorRuntime.async(function updateProduct$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // Lấy thông tin của nhân viên từ JWT token
          token = req.headers.authorization.split(" ")[1];
          decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          loggedInEmployeeId = decodedToken.userId;
          productId = req.params.id;
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Employee.findById(loggedInEmployeeId));

        case 7:
          loggedInEmployee = _context4.sent;

          if (loggedInEmployee) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Employee not found"
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 12:
          product = _context4.sent;

          if (product) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Product not found"
          }));

        case 15:
          product.name = req.body.name;
          product.description = req.body.description;
          product.price = req.body.price;
          product.quantity = req.body.quantity;
          product.categoryId = req.body.categoryId;
          product.storeId = loggedInEmployee.storeId;

          if (req.file) {
            product.imageURL = req.file.path;
          }

          _context4.next = 24;
          return regeneratorRuntime.awrap(product.save());

        case 24:
          updatedProduct = _context4.sent;
          res.json(updatedProduct);
          _context4.next = 31;
          break;

        case 28:
          _context4.prev = 28;
          _context4.t0 = _context4["catch"](4);
          res.status(400).json({
            message: _context4.t0.message
          });

        case 31:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 28]]);
};

module.exports = {
  getAllProducts: getAllProducts,
  addProduct: addProduct,
  deleteProduct: deleteProduct,
  updateProduct: updateProduct
};