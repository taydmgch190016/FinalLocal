const jwt = require("jsonwebtoken");

const checkEmployee = (req, res, next) => {
  // Kiểm tra xem người dùng đã gửi token hay chưa
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. Please log in." });
  }

  // Xác thực token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    // Kiểm tra xem vai trò của người dùng có phải là employee hay không
    if (decoded.role !== "employee") {
      return res.status(403).json({ message: "Only employee can do!" });
    }

    next();
  });
};

module.exports = checkEmployee;
