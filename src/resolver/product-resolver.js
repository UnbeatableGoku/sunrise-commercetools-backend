const { firebaseAuth } = require('../config/firebseConfig');
const {
  getProductService,
  getProductDetailsService,
  getSearchProductsService,
  getSearchSuggestionService,
  createCustomerService,
  checkSocialUserService,
  updateUserEmailService,
  deleteSocialUserService,
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

/**
 * Authenticates the user.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the authentication token.
 * @returns {Promise<String>} A greeting message upon successful authentication.
 * @throws {Error} If an error occurs during authentication.
 */
const getAuthentication = async (parent, { token }) => {
  try {
    console.log(token);
    return 'hello world';
  } catch (error) {
    console.log(error);
  }
};

/**
 * Checks if a user with the given email or phone number already exists.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the email and phone number.
 * @returns {Promise<Object>} An object indicating whether the user exists or not.
 * @throws {Error} If an error occurs while checking the user's existence.
 */

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

/**
 * Adds a new customer.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the email and phone number.
 * @param {Object} context The context object provided by the GraphQL resolver, containing the response object.
 * @returns {Promise<Object>} The result of adding the new customer.
 * @throws {Error} If an error occurs while adding the customer.
 */

const addNewCustomer = async (parent, { tokenId }, { res }) => {
  try {
    console.log(tokenId);
    const decode = await firebaseAuth.verifyIdToken(tokenId);
    console.log('this is decode --------------', decode);
    const result = await createCustomerService(
      decode.email,
      decode.phone_number,
      decode.name
    );
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};
const checkSocialUser = async (parent, { token }) => {
  try {
    const decode = await firebaseAuth.verifyIdToken(token);
    const user = await firebaseAuth.getUser(decode.uid);
    const uid = decode.uid;
    const email = user.providerData[0].email;
    const result = await checkSocialUserService(email);

    if (!result) {
      const userWithUpdatedEmail = await updateUserEmailService(uid, email);
      console.log(userWithUpdatedEmail, 'updateSOcialEmail successfully');
      return { userUpdatedWithEmail: true };
    } else {
      const deleteSocialUser = await deleteSocialUserService(uid);
      console.log(deleteSocialUser, 'deleteSocialUser successfully');
      return { userDeleted: true };
    }
  } catch (error) {
    console.log(error);
    return error;
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
    verifySocialUser: checkSocialUser,
  },
};

module.exports = { resolvers };
