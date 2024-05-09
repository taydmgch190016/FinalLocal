const bcrypt = require("bcrypt");
const Customer = require("../../models/Customer");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
// Controller để xử lý yêu cầu đăng ký từ khách hàng
const clientRegister = async (req, res) => {
  const { username, email, password, address } = req.body;

  try {
    // Kiểm tra xem tên người dùng và địa chỉ email có duy nhất không
    const existingCustomer = await Customer.findOne({
      $or: [{ username }, { email }],
    });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo một bản ghi mới cho khách hàng
    const newCustomer = new Customer({
      username,
      email,
      password: hashedPassword,
      address,
    });

    // Lưu thông tin khách hàng vào cơ sở dữ liệu
    await newCustomer.save();
    let emailCustomer = newCustomer.email;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "testnodemailer150601@gmail.com",
        pass: "lmiu qgdk kbux hwkx",
      },
      tls: { rejectUnauthorized: false },
    });
    let content = "";
    content += `
                            <div style="padding: 10px; background-color: #003375">
                                <div style="padding: 10px; background-color: white;">    
                        `;
    content += '<h4 style="color: #0085ff"> New Account </h4> <hr>';
    content +=
      '<span style="color: black"> Welcome: ' +
      newCustomer.username.toString() +
      "!</span><br>";
    content +=
      '<span style="color: black"> Welcome to our shopping store! We are thrilled to have you here. Explore a diverse range of high-quality products. Engage and discover exciting finds. Any questions? Feel free to ask. We are here to assist you. Have a delightful and satisfying shopping experience with us! ';
    ("</span><br>");
    content += "</div> </div>";
    let mainOptions = {
      from: "Final Store",
      to: emailCustomer,
      subject: "New Account ",
      text: "abc",
      html: content,
    };

    transporter.sendMail(mainOptions, function (err, info) {
      if (err) console.error("Error: ", err);
      else console.log("Message sent: ", info.response);
    });

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const clientLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm kiếm khách hàng bằng email
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { customerId: customer._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, id: customer._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  clientRegister,
  clientLogin,
};
