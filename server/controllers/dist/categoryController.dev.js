"use strict";

var Category = require("../models/Categories");

var getAllCategories = function getAllCategories(req, res) {
  var categories;
  return regeneratorRuntime.async(function getAllCategories$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Category.find());

        case 3:
          categories = _context.sent;
          res.status(200).json(categories);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Error fetching categories",
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  getAllCategories: getAllCategories
};