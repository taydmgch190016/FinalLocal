"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handleUpdateProduct = function handleUpdateProduct(productId, values) {
  var valuesWithImage, _ref, response, err, updatedProduct;

  return regeneratorRuntime.async(function handleUpdateProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          setLoading(true); // Check if the 'image' key exists in the 'values' object
          // If it doesn't exist, set the 'image' from the current state

          valuesWithImage = _objectSpread({}, values);

          if (!valuesWithImage.image) {
            valuesWithImage.image = image;
          }

          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(updateProduct(productId, valuesWithImage));

        case 6:
          _ref = _context.sent;
          response = _ref.response;
          err = _ref.err;

          if (response) {
            toast.success("Product updated successfully!");
            updatedProduct = product.map(function (prod) {
              return prod._id === productId ? _objectSpread({}, prod, {}, values) : prod;
            });
            setProduct(updatedProduct); // Update the image state only if a new image is provided

            if (valuesWithImage.image) {
              setImage(valuesWithImage.image);
            }

            setModalVisible(false);
            form.resetFields();
          }

          if (err) {
            toast.error("Error updating product!");
          }

          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](3);
          toast.error("Error updating product!");

        case 16:
          setLoading(false);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 13]]);
};