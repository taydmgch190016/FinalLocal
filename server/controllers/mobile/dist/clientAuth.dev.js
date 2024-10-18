"use strict";

var bcrypt = require("bcrypt");

var Customer = require("../../models/Customer");

var jwt = require("jsonwebtoken");

var nodemailer = require('nodemailer');

var validator = require('validator'); // Controller để xử lý yêu cầu đăng ký từ khách hàng


var clientRegister = function clientRegister(req, res) {
  var _req$body, username, email, password, address, existingCustomer, hashedPassword, newCustomer, emailCustomer, transporter, content, mainOptions;

  return regeneratorRuntime.async(function clientRegister$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password, address = _req$body.address;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Customer.findOne({
            $or: [{
              username: username
            }, {
              email: email
            }]
          }));

        case 4:
          existingCustomer = _context.sent;

          if (!existingCustomer) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Username or email already exists"
          }));

        case 7:
          if (validator.isEmail(email)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "Email is invalid"
          }));

        case 9:
          if (validator.isStrongPassword(password)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(402).json({
            message: "Password is invalid"
          }));

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 13:
          hashedPassword = _context.sent;
          // Tạo một bản ghi mới cho khách hàng
          newCustomer = new Customer({
            username: username,
            email: email,
            password: hashedPassword,
            address: address
          }); // Lưu thông tin khách hàng vào cơ sở dữ liệu

          _context.next = 17;
          return regeneratorRuntime.awrap(newCustomer.save());

        case 17:
          emailCustomer = newCustomer.email;
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
          content += '<h4 style="color: #0085ff"> New Account </h4> <hr>';
          content += '<span style="color: black"> Welcome: ' + newCustomer.username.toString() + "!</span><br>";
          content += '<span style="color: black"> Welcome to our shopping store! We are thrilled to have you here. Explore a diverse range of high-quality products. Engage and discover exciting finds. Any questions? Feel free to ask. We are here to assist you. Have a delightful and satisfying shopping experience with us! ';
          "</span><br>";
          content += "</div> </div>";
          mainOptions = {
            from: "Final Store",
            to: emailCustomer,
            subject: "New Account ",
            text: "abc",
            html: content
          };
          transporter.sendMail(mainOptions, function (err, info) {
            if (err) console.error("Error: ", err);else console.log("Message sent: ", info.response);
          });
          res.status(201).json({
            message: "Customer registered successfully"
          });
          _context.next = 34;
          break;

        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: _context.t0.message
          });

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 31]]);
};

var clientLogin = function clientLogin(req, res) {
  var _req$body2, email, password, customer, isPasswordValid, token;

  return regeneratorRuntime.async(function clientLogin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Customer.findOne({
            email: email
          }));

        case 4:
          customer = _context2.sent;

          if (customer) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Customer not found"
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, customer.password));

        case 9:
          isPasswordValid = _context2.sent;

          if (isPasswordValid) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            message: "Invalid password"
          }));

        case 12:
          // Tạo JWT token
          token = jwt.sign({
            customerId: customer._id
          }, process.env.JWT_SECRET, {
            expiresIn: "7d"
          });
          res.json({
            message: "Login successful",
            token: token,
            id: customer._id
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

module.exports = {
  clientRegister: clientRegister,
  clientLogin: clientLogin
};