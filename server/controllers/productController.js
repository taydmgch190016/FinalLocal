

const Product = require("../models/Product");

exports.getProductsByStoreId = async (req, res) => {
  const { storeId } = req.params;

  try {
    const products = await Product.find({ storeId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByStoreAndCategory = async (req, res) => {
  const { storeId, categoryId } = req.params;
  try {
    let products;
    if (categoryId) {
      products = await Product.find({ storeId, categoryId });
    } else {
      products = await Product.find({ storeId });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { name } = req.query;


    const products = await Product.find({ name: { $regex: name, $options: 'i' } });

    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
}