const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../../models/Employee");
const Admin = require("../../models/Admin");

exports.webLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Employee.findOne({ email }).populate("storeId");
    let role = "employee";
    let storeId = null;

    if (!user) {
      user = await Admin.findOne({ email });
      role = "admin";
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (role === "employee" && user.storeId) {
      storeId = user.storeId._id;
    }

    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      id: user._id,
      role,
      storeId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.registerEmployee = async (req, res) => {
  const { email, password, storeId } = req.body;

  try {

    let existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newEmployee = new Employee({
      email,
      password: hashedPassword,
      storeId,
    });
    await newEmployee.save();

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.logout = async (req, res) => {

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");

  res.json({ message: "Đăng xuất thành công" });
};
