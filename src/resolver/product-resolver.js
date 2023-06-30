const { v4: uuidv4 } = require('uuid');
const { apiRoot } = require('../config/ctpClient');

const getProducts = async () => {
  try {
    const products = await apiRoot.productProjections().get({}).execute();

    const productsWithId = products.body.results.map((product) => ({
      ...product,
      masterVariant: {
        ...product.masterVariant,
        id: uuidv4(),
      },
    }));

    return productsWithId;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch products');
  }
};

const getProductDetails = async (parent, { id }) => {
  console.log(id);
  try {
    const details = await apiRoot
      .productProjections()
      .withId({ ID: id })
      .get({})
      .execute();
    return details.body;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch product details ');
  }
};

const resolvers = {
  Query: {
    products: getProducts,
    singleProduct: getProductDetails,
  },
};

module.exports = { resolvers };
