"use strict";

var Store = require("../models/Store");

var jwt = require("jsonwebtoken");

var Admin = require("../models/Admin");

exports.getStores = function _callee(req, res) {
  var stores;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Store.find());

        case 3:
          stores = _context.sent;
          res.json(stores);
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

exports.addStore = function _callee2(req, res) {
  var token, decodedToken, loggedInAdminId, loggedInAdmin, store, newStore;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = req.headers.authorization.split(" ")[1];
          decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          loggedInAdminId = decodedToken.userId;
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Admin.findById(loggedInAdminId));

        case 6:
          loggedInAdmin = _context2.sent;

          if (loggedInAdmin) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Admin not found"
          }));

        case 9:
          store = new Store({
            name: req.body.name,
            address: req.body.address
          });
          _context2.next = 12;
          return regeneratorRuntime.awrap(store.save());

        case 12:
          newStore = _context2.sent;
          res.status(201).json(newStore);
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

exports.updateStore = function _callee3(req, res) {
  var token, decodedToken, loggedInAdminId, storeId, loggedInAdmin, store, _req$body, name, address, updatedStore;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          token = req.headers.authorization.split(" ")[1];
          decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          loggedInAdminId = decodedToken.userId;
          storeId = req.params.id;
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Admin.findById(loggedInAdminId));

        case 7:
          loggedInAdmin = _context3.sent;

          if (loggedInAdmin) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Admin not found"
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(Store.findById(storeId));

        case 12:
          store = _context3.sent;

          if (store) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Store not found"
          }));

        case 15:
          _req$body = req.body, name = _req$body.name, address = _req$body.address;
          store.name = name;
          store.address = address;
          _context3.next = 20;
          return regeneratorRuntime.awrap(store.save());

        case 20:
          updatedStore = _context3.sent;
          res.json(updatedStore);
          _context3.next = 27;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](4);
          res.status(400).json({
            message: _context3.t0.message
          });

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 24]]);
};

exports.deleteStore = function _callee4(req, res) {
  var token, decodedToken, loggedInAdminId, storeId, loggedInAdmin, store;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          token = req.headers.authorization.split(" ")[1];
          decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          loggedInAdminId = decodedToken.userId;
          storeId = req.params.id;
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Admin.findById(loggedInAdminId));

        case 7:
          loggedInAdmin = _context4.sent;

          if (loggedInAdmin) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Admin not found"
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(Store.findById(storeId));

        case 12:
          store = _context4.sent;

          if (store) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Store not found"
          }));

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(store.deleteOne());

        case 17:
          res.json({
            message: "Store deleted"
          });
          _context4.next = 23;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](4);
          res.status(500).json({
            message: _context4.t0.message
          });

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 20]]);
};