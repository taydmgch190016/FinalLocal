"use strict";

var bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

var Employee = require("../../models/Employee");

var Admin = require("../../models/Admin");

exports.webLogin = function _callee(req, res) {
  var _req$body, email, password, user, role, storeId, isPasswordValid, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Employee.findOne({
            email: email
          }).populate("storeId"));

        case 4:
          user = _context.sent;
          role = "employee";
          storeId = null;

          if (user) {
            _context.next = 12;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(Admin.findOne({
            email: email
          }));

        case 10:
          user = _context.sent;
          role = "admin";

        case 12:
          if (user) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Invalid credentials"
          }));

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 16:
          isPasswordValid = _context.sent;

          if (isPasswordValid) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Invalid credentials"
          }));

        case 19:
          if (role === "employee" && user.storeId) {
            storeId = user.storeId._id;
          }

          token = jwt.sign({
            userId: user._id,
            role: role
          }, process.env.JWT_SECRET, {
            expiresIn: "7d"
          });
          res.json({
            message: "Login successful",
            token: token,
            id: user._id,
            role: role,
            storeId: storeId
          });
          _context.next = 27;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: _context.t0.message
          });

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 24]]);
};

exports.registerEmployee = function _callee2(req, res) {
  var _req$body2, email, password, storeId, existingEmployee, hashedPassword, newEmployee;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password, storeId = _req$body2.storeId;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Employee.findOne({
            email: email
          }));

        case 4:
          existingEmployee = _context2.sent;

          if (!existingEmployee) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Email already exists"
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 9:
          hashedPassword = _context2.sent;
          newEmployee = new Employee({
            email: email,
            password: hashedPassword,
            storeId: storeId
          });
          _context2.next = 13;
          return regeneratorRuntime.awrap(newEmployee.save());

        case 13:
          res.status(201).json({
            message: "Employee registered successfully"
          });
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 16]]);
};

exports.logout = function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          res.json({
            message: "Đăng xuất thành công"
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};