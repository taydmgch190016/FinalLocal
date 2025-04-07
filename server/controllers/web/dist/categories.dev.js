"use strict";

var Category = require("../../models/Categories");

var jwt = require("jsonwebtoken");

var Employee = require("../../models/Employee");

exports.getAllCategories = function _callee(req, res) {
  var categories;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Category.find());

        case 3:
          categories = _context.sent;
          res.json(categories);
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
};

exports.addCategory = function _callee2(req, res) {
  var token, decodedToken, loggedInEmployeeId, loggedInEmployee, category, newCategory;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
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
          category = new Category({
            name: req.body.name
          });
          _context2.next = 12;
          return regeneratorRuntime.awrap(category.save());

        case 12:
          newCategory = _context2.sent;
          res.status(201).json(newCategory);
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](3);
          res.status(400).json({
            message: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 16]]);
};

exports.deleteCategory = function _callee3(req, res) {
  var token, decodedToken, loggedInEmployeeId, categoryId, loggedInEmployee, category;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          token = req.headers.authorization.split(" ")[1];
          decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          loggedInEmployeeId = decodedToken.userId;
          categoryId = req.params.id;
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
          return regeneratorRuntime.awrap(Category.findById(categoryId));

        case 12:
          category = _context3.sent;

          if (category) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Category not found"
          }));

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(category.deleteOne());

        case 17:
          res.json({
            message: "Category deleted successfully"
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
};

exports.updateCategory = function _callee4(req, res) {
  var token, decodedToken, loggedInEmployeeId, categoryId, loggedInEmployee, category, updatedCategory;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          token = req.headers.authorization.split(" ")[1];
          decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          loggedInEmployeeId = decodedToken.userId;
          categoryId = req.params.id;
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
          return regeneratorRuntime.awrap(Category.findById(categoryId));

        case 12:
          category = _context4.sent;

          if (category) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Category not found"
          }));

        case 15:
          category.name = req.body.name;
          _context4.next = 18;
          return regeneratorRuntime.awrap(category.save());

        case 18:
          updatedCategory = _context4.sent;
          res.json(updatedCategory);
          _context4.next = 25;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](4);
          res.status(400).json({
            message: _context4.t0.message
          });

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 22]]);
};