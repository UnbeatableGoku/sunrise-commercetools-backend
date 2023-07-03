const {
  getProductService,
  getProductDetailsService,
  getSearchProductsService,
  getSearchSuggestionService,
} = require('../services/product-service');

/**
 * Retrieves a list of products.
 *
 * @returns {Promise<Array<Object>>} The list of products.
 * @throws {Error} If an error occurs while fetching the products.
 */
const getProducts = async () => {
  try {
    const products = await getProductService();
    return products;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch products');
  }
};

/**
 * Retrieves details for a specific product.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the ID of the product.
 * @returns {Promise<Object>} The details of the product.
 * @throws {Error} If an error occurs while fetching the product details.
 */
const getProductDetails = async (parent, { id }) => {
  console.log(id);
  try {
    const details = await getProductDetailsService(id);
    return details;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch product details');
  }
};

/**
 * Retrieves a list of products based on a search query.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the search query.
 * @returns {Promise<Array<Object>>} The list of searched products.
 * @throws {Error} If an error occurs while fetching the products.
 */
const getSearchedProducts = async (parent, { query }) => {
  try {
    const products = await getSearchProductsService(query);
    return products;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch products');
  }
};

/**
 * Retrieves search suggestions based on a keyword.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the keyword.
 * @returns {Promise<Array<String>>} The list of search suggestions.
 * @throws {Error} If an error occurs while fetching the suggestions.
 */
const getSearchSuggestion = async (parent, { keyword }) => {
  try {
    const suggestion = await getSearchSuggestionService(keyword);
    return suggestion;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch the suggestion');
  }
};

const resolvers = {
  Query: {
    products: getProducts,
    singleProduct: getProductDetails,
    searchProducts: getSearchedProducts,
    searchSuggestion: getSearchSuggestion,
  },
};

module.exports = { resolvers };
