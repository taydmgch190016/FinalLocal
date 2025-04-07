"use strict";

var jwt = require("jsonwebtoken");

var checkAdmin = function checkAdmin(req, res, next) {
  var token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Please log in."
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).json({
        message: "Invalid token."
      });
    } // Kiểm tra xem vai trò của người dùng có phải là admin hay không


    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can register employee."
      });
    }

    next();
  });
};

module.exports = checkAdmin;