const { authClient } = require("../config/buildClient");
const { firebaseAuth } = require("../config/firebseConfig");
const {
  getProductService,
  getProductDetailsService,
  getSearchProductsService,
  getSearchSuggestionService,
  addFirstItemToCartService,
  addLineItemsService,
  removeCartItemService,
  addShippingAddressService,
  getCartByIdService,
  changeLineItemsQtyService,
  addShippingMethodForUserService,
  addBilligAddressService,
  getTotalCartItemsService,
  generateOrderByCartService,
  decodeTokenService,
  getOrderListService,
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
 * Adds a shipping address for a user to a cart.
 *
 * @param {Object} parent The parent object provided by the GraphQL resolver.
 * @param {Object} args The arguments provided for the resolver, containing the shipping address input, cart ID, and version ID.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs while adding the shipping address.
 */
const addShippingAddressForUser = async (
  parent,
  { addresInput, cartId, versionId }
) => {
  console.log(addresInput, "000000000000000000000000000000");
  const result = await addShippingAddressService(
    cartId,
    versionId,
    addresInput.firstName,
    addresInput.lastName,
    addresInput.streetName,
    addresInput.country,
    addresInput.city,
    addresInput.postalCode,
    addresInput.phone
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

const addShippingMethodForUser = async (
  parent,
  { cartId, versionId, shippingMethodId }
) => {
  try {
    const result = await addShippingMethodForUserService(
      cartId,
      versionId,
      shippingMethodId
    );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed To add shipping method");
  }
};

const addBillingAddressForUser = async (
  parent,
  { addresInput, cartId, versionId }
) => {
  try {
    const result = await addBilligAddressService(
      cartId,
      versionId,
      addresInput.firstName,
      addresInput.lastName,
      addresInput.streetName,
      addresInput.country,
      addresInput.city,
      addresInput.postalCode,
      addresInput.phone
    );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add billingAddress");
  }
};
const getTotalCartItems = async (parent, { cartId }) => {
  try {
    const result = await getTotalCartItemsService(cartId);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("failed to get total cart items");
  }
};

const generateOrderByCart = async (parent, { cartId, versionId }) => {
  try {
    const result = await generateOrderByCartService(cartId, versionId);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("failed to genereate order by cartid");
  }
};

const productResolver = {
  Query: {
    products: getProducts,
    singleProduct: getProductDetails,
    searchProducts: getSearchedProducts,
    searchSuggestion: getSearchSuggestion,
  },
  Mutation: {
    auth: getAuthentication,
    createCart: addFirstItemToCart,
    addItemsToCart: addLineItems,
    removeItemFromCart: removeCartItem,
    addShippingAddress: addShippingAddressForUser,
    getCartById: getCartItems,
    changeCartItemsQty: changeLineItemsQty,
    addShippingMethod: addShippingMethodForUser,
    addBillingAddress: addBillingAddressForUser,
    getCartItems: getTotalCartItems,
    generateOrderByCartID: generateOrderByCart,
  },
};

module.exports = { productResolver };
