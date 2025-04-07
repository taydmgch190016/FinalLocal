const Store = require("../models/Store");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");


exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addStore = async (req, res) => {

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInAdminId = decodedToken.userId;

  try {

    const loggedInAdmin = await Admin.findById(loggedInAdminId);

    if (!loggedInAdmin) {

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


exports.updateStore = async (req, res) => {

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInAdminId = decodedToken.userId;

  const storeId = req.params.id;

  try {

    const loggedInAdmin = await Admin.findById(loggedInAdminId);

    if (!loggedInAdmin) {
  
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


exports.deleteStore = async (req, res) => {
  
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const loggedInAdminId = decodedToken.userId;

  const storeId = req.params.id;

  try {
    
    const loggedInAdmin = await Admin.findById(loggedInAdminId);

    if (!loggedInAdmin) {
      
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
