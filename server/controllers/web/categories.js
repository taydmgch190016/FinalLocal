const Category = require("../../models/Categories");
const jwt = require("jsonwebtoken");
const Employee = require("../../models/Employee");

// Controller để xử lý các yêu cầu liên quan đến danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCategory = async (req, res) => {
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
    const category = new Category({
      name: req.body.name,
    });

    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete category
exports.deleteCategory = async (req, res) => {
  // Lấy thông tin của nhân viên từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInEmployeeId = decodedToken.userId;

  const categoryId = req.params.id;

  try {
    // Tìm kiếm thông tin của nhân viên dựa trên id
    const loggedInEmployee = await Employee.findById(loggedInEmployeeId);

    if (!loggedInEmployee) {
      // Nếu không tìm thấy nhân viên, trả về lỗi
      return res.status(404).json({ message: "Employee not found" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update category
exports.updateCategory = async (req, res) => {
  // Lấy thông tin của nhân viên từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInEmployeeId = decodedToken.userId;

  const categoryId = req.params.id;

  try {
    // Tìm kiếm thông tin của nhân viên dựa trên id
    const loggedInEmployee = await Employee.findById(loggedInEmployeeId);

    if (!loggedInEmployee) {
      // Nếu không tìm thấy nhân viên, trả về lỗi
      return res.status(404).json({ message: "Employee not found" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    category.name = req.body.name;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
