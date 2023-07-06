const { firebaseAuth } = require('../config/firebseConfig');
const {
  getProductService,
  getProductDetailsService,
  getSearchProductsService,
  getSearchSuggestionService,
  createCustomerService,
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

const getAuthentication = async (parent, { token }) => {
  try {
    console.log(token);
    return 'hello world';
  } catch (error) {
    console.log(error);
  }
};

const checkExistUser = async (parent, { email, phoneNumber }) => {
  try {
    const result = await firebaseAuth.getUserByEmail(email);
    console.log(result);
    if (result) {
      return {
        userExist: true,
      };
    }
  } catch (error) {
    console.log(error);
    try {
      const userByPhone = await firebaseAuth.getUserByPhoneNumber(phoneNumber);
      if (userByPhone) {
        return { userExist: true };
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/user-not-found') {
        return {
          userExist: false,
        };
      }
    }
  }
};

const addNewCustomer = async (parent, { email, phoneNumber }, { res }) => {
  try {
    const result = await createCustomerService(email, phoneNumber);
    console.log(result);
    res.set('Set-Cookie', `token=123123123; HttpOnly`);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const resolvers = {
  Query: {
    products: getProducts,
    singleProduct: getProductDetails,
    searchProducts: getSearchedProducts,
    searchSuggestion: getSearchSuggestion,
  },
  Mutation: {
    auth: getAuthentication,
    verifyExistUser: checkExistUser,
    createCustomer: addNewCustomer,
  },
};

module.exports = { resolvers };
