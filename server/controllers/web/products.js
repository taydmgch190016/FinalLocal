const multer = require("multer");
const jwt = require("jsonwebtoken");
const Employee = require("../../models/Employee");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Product = require("../../models/Product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm controller để thêm sản phẩm
const addProduct = async (req, res) => {
  // Lấy thông tin của nhân viên từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInEmployeeId = decodedToken.userId;

  try {
    // Tìm kiếm thông tin của nhân viên dựa trên id
    const loggedInEmployee = await Employee.findById(loggedInEmployeeId);

    if (!loggedInEmployee) {
      // Nếu không tìm thấy nhân viên, trả về lỗi
      return res.status(404).json({ message: "Employee not found" });
    }

    // Tạo sản phẩm mới và gán storeId từ nhân viên đăng nhập
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      imageURL: req.file ? req.file.path : "", // Lấy đường dẫn ảnh từ multer
      storeId: loggedInEmployee.storeId, // Gán storeId của nhân viên
      categoryId: req.body.categoryId,
    });
    // Lưu sản phẩm vào cơ sở dữ liệu
    const savedProduct = await newProduct.save();

    // Trả về thông tin của sản phẩm đã được lưu
    res.status(201).json(savedProduct);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: error.message });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  // Lấy thông tin của nhân viên từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInEmployeeId = decodedToken.userId;

  const productId = req.params.id;

  try {
    // Tìm kiếm thông tin của nhân viên dựa trên id
    const loggedInEmployee = await Employee.findById(loggedInEmployeeId);

    if (!loggedInEmployee) {
      // Nếu không tìm thấy nhân viên, trả về lỗi
      return res.status(404).json({ message: "Employee not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update product
const updateProduct = async (req, res) => {
  // Lấy thông tin của nhân viên từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInEmployeeId = decodedToken.userId;

  const productId = req.params.id;

  try {
    // Tìm kiếm thông tin của nhân viên dựa trên id
    const loggedInEmployee = await Employee.findById(loggedInEmployeeId);

    if (!loggedInEmployee) {
      // Nếu không tìm thấy nhân viên, trả về lỗi
      return res.status(404).json({ message: "Employee not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.categoryId = req.body.categoryId;
    product.storeId = loggedInEmployee.storeId;
    if (req.file) {
      product.imageURL = req.file.path;
    }
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct,
};
