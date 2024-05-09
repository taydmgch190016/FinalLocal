const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
