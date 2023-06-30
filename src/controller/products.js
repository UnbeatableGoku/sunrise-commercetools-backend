const { apiRoot } = require('../config/ctpClient');
const fetchProducts = async (req, res) => {
  try {
    const response = await apiRoot.productProjections().get().execute();

    const products = response.body.results;
    console.log(products);
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

module.exports = { fetchProducts };
