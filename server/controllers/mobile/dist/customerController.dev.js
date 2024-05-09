"use strict";

var express = require("express");

var Customer = require("../../models/Customer");

var getCustomer = function getCustomer(req, res) {
  var customer;
  return regeneratorRuntime.async(function getCustomer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Customer.findById(req.params.id));

        case 3:
          customer = _context.sent;

          if (customer) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Customer not found"
          }));

        case 6:
          res.json(customer);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching customer:", _context.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  getCustomer: getCustomer
};