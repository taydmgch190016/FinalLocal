const Store = require("../models/Store");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Controller để lấy danh sách cửa hàng từ cơ sở dữ liệu
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller để thêm cửa hàng mới vào cơ sở dữ liệu
exports.addStore = async (req, res) => {
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
    const store = new Store({
      name: req.body.name,
      address: req.body.address,
    });

    const newStore = await store.save();
    res.status(201).json(newStore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller để cập nhật thông tin cửa hàng
exports.updateStore = async (req, res) => {
  // Lấy thông tin của admin từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInAdminId = decodedToken.userId;

  const storeId = req.params.id;

  try {
    // Tìm kiếm thông tin của admin dựa trên id
    const loggedInAdmin = await Admin.findById(loggedInAdminId);

    if (!loggedInAdmin) {
      // Nếu không tìm thấy admin, trả về lỗi
      return res.status(404).json({ message: "Admin not found" });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const { name, address } = req.body;

    store.name = name;
    store.address = address;
    const updatedStore = await store.save();
    res.json(updatedStore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller để xóa cửa hàng
exports.deleteStore = async (req, res) => {
  // Lấy thông tin của admin từ JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInAdminId = decodedToken.userId;

  const storeId = req.params.id;

  try {
    // Tìm kiếm thông tin của admin dựa trên id
    const loggedInAdmin = await Admin.findById(loggedInAdminId);

    if (!loggedInAdmin) {
      // Nếu không tìm thấy admin, trả về lỗi
      return res.status(404).json({ message: "Admin not found" });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await store.deleteOne();
    res.json({ message: "Store deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
