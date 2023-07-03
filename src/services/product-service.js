const { apiRoot } = require('../config/ctpClient');
const { v4: uuidv4 } = require('uuid');

/**
 * Retrieves a list of products and assigns a unique ID to each master variant.
 *
 * @returns {Promise<Array<Object>>} The list of products with assigned IDs.
 * @throws {Error} If an error occurs during the API call.
 */
const getProductService = async () => {
  try {
    const products = await apiRoot.productProjections().get({}).execute();

    const productsWithId = products.body.results.map((product) => ({
      ...product,
      masterVariant: {
        ...product.masterVariant,
        id: uuidv4(), // Assigns a unique ID using the uuidv4 function
      },
    }));

    return productsWithId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Retrieves product details for a specific ID.
 *
 * @param {string} id The ID of the product to retrieve details for.
 * @returns {Promise<Object>} The details of the product.
 * @throws {Error} If an error occurs during the API call.
 */
const getProductDetailsService = async (id) => {
  try {
    const details = await apiRoot
      .productProjections()
      .withId({ ID: id })
      .get({})
      .execute();
    return details.body;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Performs a search for products based on a query.
 *
 * @param {string} query The search query.
 * @returns {Promise<Array<Object>>} The list of searched products.
 * @throws {Error} If an error occurs during the API call.
 */
const getSearchProductsService = async (query) => {
  try {
    console.log(query);
    const products = await apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { 'text.en': query, limit: 20, fuzzy: true } })
      .execute();
    const productsWithId = products.body.results.map((product) => ({
      ...product,
      masterVariant: {
        ...product.masterVariant,
        id: uuidv4(), // Assigns a unique ID using the uuidv4 function
      },
    }));

    return productsWithId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Retrieves search suggestions based on a keyword.
 *
 * @param {string} keyword The keyword for which to fetch suggestions.
 * @returns {Promise<Array<string>>} The list of search suggestions.
 * @throws {Error} If an error occurs during the API call.
 */
const getSearchSuggestionService = async (keyword) => {
  try {
    const suggestion = await apiRoot
      .productProjections()
      .suggest()
      .get({
        queryArgs: {
          'searchKeywords.en': keyword,
          fuzzy: true,
        },
      })
      .execute();
    return suggestion.body['searchKeywords.en'];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Export the functions for external use
module.exports = {
  getProductService,
  getProductDetailsService,
  getSearchProductsService,
  getSearchSuggestionService,
};
