"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProduct = void 0;

var _axios = _interopRequireDefault(require("./axios.client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getProduct = function getProduct() {
  var response;
  return regeneratorRuntime.async(function getProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].get("products/listProduct"));

        case 3:
          response = _context.sent;
          return _context.abrupt("return", {
            response: response
          });

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", {
            err: _context.t0
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getProduct = getProduct;

var addProduct = function addProduct(_ref) {
  var name, description, price, quantity, image, storeId, categoryId, formData, response;
  return regeneratorRuntime.async(function addProduct$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          name = _ref.name, description = _ref.description, price = _ref.price, quantity = _ref.quantity, image = _ref.image, storeId = _ref.storeId, categoryId = _ref.categoryId;
          formData = new FormData();
          formData.append("name", name);
          formData.append("description", description);
          formData.append("price", price);
          formData.append("quantity", quantity);
          formData.append("image", image);
          formData.append("storeId", storeId);
          formData.append("categoryId", categoryId);
          _context2.prev = 9;
          _context2.next = 12;
          return regeneratorRuntime.awrap(_axios["default"].post("products/addProduct", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }));

        case 12:
          response = _context2.sent;
          return _context2.abrupt("return", {
            response: response
          });

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](9);
          return _context2.abrupt("return", {
            err: _context2.t0
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[9, 16]]);
};

exports.addProduct = addProduct;

var updateProduct = function updateProduct(productId, _ref2) {
  var name, description, price, quantity, image, storeId, categoryId, formData, response;
  return regeneratorRuntime.async(function updateProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          name = _ref2.name, description = _ref2.description, price = _ref2.price, quantity = _ref2.quantity, image = _ref2.image, storeId = _ref2.storeId, categoryId = _ref2.categoryId;
          formData = new FormData();
          formData.append("name", name);
          formData.append("description", description);
          formData.append("price", price);
          formData.append("quantity", quantity);
          formData.append("image", image);
          formData.append("storeId", storeId);
          formData.append("categoryId", categoryId);
          _context3.prev = 9;
          _context3.next = 12;
          return regeneratorRuntime.awrap(_axios["default"].put("products/updateProduct/".concat(productId), formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }));

        case 12:
          response = _context3.sent;
          return _context3.abrupt("return", {
            response: response
          });

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](9);
          return _context3.abrupt("return", {
            err: _context3.t0
          });

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[9, 16]]);
};

exports.updateProduct = updateProduct;

var deleteProduct = function deleteProduct(productId) {
  var response;
  return regeneratorRuntime.async(function deleteProduct$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_axios["default"]["delete"]("products/deleteProduct/".concat(productId)));

        case 3:
          response = _context4.sent;
          return _context4.abrupt("return", {
            response: response
          });

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", {
            err: _context4.t0
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.deleteProduct = deleteProduct;