const { authClient } = require("../config/buildClient");
const { apiRoot } = require("../config/ctpClient");
const { firebaseAuth } = require("../config/firebseConfig");
const {
  getProductService,
  getProductDetailsService,
  getSearchProductsService,
  getSearchSuggestionService,
  createCustomerService,
  checkSocialUserService,
  updateUserEmailService,
  deleteSocialUserService,
  addToCartService,
  addFirstItemToCartService,
  addLineItemsService,
  removeCartItemService,
  addEmailIdAsGuestUserService,
  addShippingAddressService,
  getCartByIdService,
  changeLineItemsQtyService,
} = require("../services/product-service");
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
    throw new Error("Failed to fetch products");
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
    throw new Error("Failed to fetch product details");
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
    throw new Error("Failed to fetch products");
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
    throw new Error("Failed to fetch the suggestion");
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
    return "hello world";
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
      if (error.code === "auth/user-not-found") {
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
    const user = await firebaseAuth.getUser(decode.uid);
    console.log("this is decode --------------", user);

    const result = await createCustomerService(
      user.email,
      user.phoneNumber || user.phone_number,
      user.displayName || user.name
    );
    console.log(result, "-------------------------this is result ");
    const accesstoken = await authClient.customerPasswordFlow({
      username: user.email,
      password: user.email,
    });
    const cookieOption = { httpOnly: true, sameSite: "none", secure: true };
    res.cookie("token", accesstoken.access_token, cookieOption);
    return accesstoken;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add new customer");
  }
};

/**
 * Checks if a user with the given token is a social user and returns the corresponding response.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the token.
 * @returns {Promise<Object>} The response indicating the user's status.
 * @throws {Error} If an error occurs during the process.
 */
const checkSocialUser = async (parent, { token }) => {
  try {
    const decode = await firebaseAuth.verifyIdToken(token);
    const user = await firebaseAuth.getUser(decode.uid);
    const uid = decode.uid;
    const email = user.providerData[0].email;
    const result = await checkSocialUserService(email);
    console.log(result, "this is result ");
    if (result > 1) {
      const deleteSocialUser = await deleteSocialUserService(uid);
      console.log(deleteSocialUser, "deleteSocialUser successfully");
      return { signupWithSocial: false };
    }
    if (result === 1) {
      return { loginWithSocial: true };
    } else {
      const userWithUpdatedEmail = await updateUserEmailService(uid, email);
      console.log(userWithUpdatedEmail, "updateSocialEmail successfully");
      return { signupWithSocial: true };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to check social user");
  }
};

/**
 * Generates a customer token for the authenticated user.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the token.
 * @param {Object} context The context object provided by the GraphQL resolver, containing the request and response objects.
 * @returns {Promise<Object>} The generated customer token.
 * @throws {Error} If an error occurs during the process.
 */
const generateCustomerToken = async (parent, { token }, { req, res }) => {
  try {
    const decode = await firebaseAuth.verifyIdToken(token);
    const user = await firebaseAuth.getUser(decode.uid);
    const accesstoken = await authClient.customerPasswordFlow({
      username: user.email,
      password: user.email,
    });
    const cookieOption = { httpOnly: true, sameSite: "none", secure: true };
    res.cookie("token", accesstoken.access_token, cookieOption);
    return accesstoken;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate customer token");
  }
};

/**
 * Adds the first item to a cart.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the product ID.
 * @returns {Promise<Object>} The created cart.
 * @throws {Error} If an error occurs while adding the item to the cart.
 */
const addFirstItemToCart = async (parent, { productId }) => {
  try {
    const items = await addFirstItemToCartService(productId);
    console.log(items);
    return items;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add first item to cart");
  }
};

/**
 * Adds line items to a cart.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the product ID, cart ID, and version ID.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs while adding the line items.
 */
const addLineItems = async (parent, { productId, cartId, versionId }) => {
  try {
    const result = await addLineItemsService(productId, cartId, versionId);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add Line items");
  }
};

/**
 * Removes a line item from a cart.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the line item ID, cart ID, and version ID.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs while removing the line item.
 */
const removeCartItem = async (parent, { lineItemId, cartId, versionId }) => {
  const result = await removeCartItemService(lineItemId, cartId, versionId);
  return result;
};

/**
 * Adds an email ID as a guest user to a cart.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the cart ID, version ID, and email.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs while adding the email ID.
 */
const addEmailIdAsGuestUser = async (parent, { cartId, versionId, email }) => {
  const result = await addEmailIdAsGuestUserService(cartId, versionId, email);
  return result;
};

/**
 * Adds a shipping address for a user to a cart.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the shipping address input, cart ID, and version ID.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs while adding the shipping address.
 */
const addShippingAddressForUser = async (
  parent,
  { shippingAddresInput, cartId, versionId }
) => {
  const result = await addShippingAddressService(
    cartId,
    versionId,
    shippingAddresInput.firstName,
    shippingAddresInput.lastName,
    shippingAddresInput.streetName,
    shippingAddresInput.country,
    shippingAddresInput.city,
    shippingAddresInput.postalCode,
    shippingAddresInput.phone
  );
  return result;
};

/**
 * Retrieves the items in a cart specified by its ID.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the cart ID.
 * @returns {Promise<Object>} The cart items.
 * @throws {Error} If an error occurs while fetching the cart items.
 */
const getCartItems = async (parent, { cartId }) => {
  try {
    const result = await getCartByIdService(cartId);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

/**
 * Changes the quantity of a line item in a cart.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the cart ID, version ID, line item ID, and quantity.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs while changing the quantity.
 */
const changeLineItemsQty = async (
  parent,
  { cartId, versionId, lineItemId, quantity }
) => {
  try {
    const result = await changeLineItemsQtyService(
      cartId,
      versionId,
      lineItemId,
      quantity
    );
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
    verifySocialUser: checkSocialUser,
    generateToken: generateCustomerToken,
    createCart: addFirstItemToCart,
    addItemsToCart: addLineItems,
    removeItemFromCart: removeCartItem,
    addEmailIdAsGuest: addEmailIdAsGuestUser,
    addShippingAddress: addShippingAddressForUser,
    getCartById: getCartItems,
    changeCartItemsQty: changeLineItemsQty,
  },
};

module.exports = { resolvers };
