const jwt = require("jsonwebtoken");
const Employee = require("../../models/Employee");
const Admin = require("../../models/Admin");
const bcrypt = require("bcrypt");

// Controller để xử lý các yêu cầu liên quan đến danh mục
exports.getAllEmployees = async (req, res) => {
  try {
    const employee = await Employee.find();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  // Lấy thông tin của admin từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInAdminId = decodedToken.userId;

  try {
    // Tìm kiếm thông tin của admin dựa trên id
    const loggedInAdmin = await Admin.findById(loggedInAdminId);

    if (!loggedInAdmin) {
      // Nếu không tìm thấy admin, trả về lỗi
      return res.status(404).json({ message: "Admin not found" });
    }

    const { email, password, storeId } = req.body;
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo tài khoản nhân viên mới
    const newEmployee = new Employee({
      email,
      password: hashedPassword,
      storeId,
    });
    await newEmployee.save();

    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  // Lấy thông tin của admin từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInAdminId = decodedToken.userId;

  const employeeId = req.params.id;

  try {
    // Tìm kiếm thông tin của admin dựa trên id
    const loggedInAdmin = await Admin.findById(loggedInAdminId);

    if (!loggedInAdmin) {
      // Nếu không tìm thấy admin, trả về lỗi
      return res.status(404).json({ message: "Admin not found" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { email, password, storeId } = req.body;
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    employee.email = email;
    employee.password = hashedPassword;
    employee.storeId = storeId;
    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  // Lấy thông tin của admin từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInAdminId = decodedToken.userId;

  const employeeId = req.params.id;

  try {
    // Tìm kiếm thông tin của admin dựa trên id
    const loggedInAdmin = await Admin.findById(loggedInAdminId);

    if (!loggedInAdmin) {
      // Nếu không tìm thấy admin, trả về lỗi
      return res.status(404).json({ message: "Admin not found" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await employee.deleteOne();
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
