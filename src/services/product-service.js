const { apiRoot } = require('../config/ctpClient');
const crypto = require('crypto');
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

/**
 * Adds the first item to a cart.
 *
 * @param {string} productId The ID of the product to add to the cart.
 * @returns {Promise<Object>} The created cart.
 * @throws {Error} If an error occurs during the API call.
 */
const addFirstItemToCartService = async (productId) => {
  try {
    const cartItemDraft = {
      currency: 'EUR',
      quantity: 1,
      lineItems: [
        {
          productId: productId,
          quantity: 1,
        },
      ],
    };
    const createdCart = await apiRoot
      .carts()
      .post({ body: cartItemDraft })
      .execute();
    return createdCart.body;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Adds line items to a cart.
 *
 * @param {string} productId The ID of the product to add as a line item.
 * @param {string} cartId The ID of the cart to add the line items to.
 * @param {string} versionId The version ID of the cart.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs during the API call.
 */
const addLineItemsService = async (productId, cartId, versionId) => {
  try {
    const updatedCart = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: parseInt(versionId),
          actions: [
            {
              action: 'addLineItem',
              productId: productId,
              variantId: 1,
            },
          ],
        },
      })
      .execute();
    console.log(updatedCart);
    return updatedCart.body;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Removes a line item from a cart.
 *
 * @param {string} lineItemId The ID of the line item to remove.
 * @param {string} cartId The ID of the cart.
 * @param {string} versionId The version ID of the cart.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs during the API call.
 */
const removeCartItemService = async (lineItemId, cartId, versionId) => {
  try {
    const updatedCart = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: parseInt(versionId),
          actions: [
            {
              action: 'removeLineItem',
              lineItemId,
            },
          ],
        },
      })
      .execute();
    return updatedCart.body;
    console.log(updatedCart.body);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Adds a shipping address to a cart.
 *
 * @param {string} cartId The ID of the cart.
 * @param {string} versionId The version ID of the cart.
 * @param {string} firstName The first name of the recipient.
 * @param {string} lastName The last name of the recipient.
 * @param {string} streetName The street name of the address.
 * @param {string} country The country of the address.
 * @param {string} city The city of the address.
 * @param {string} postalCode The postal code of the address.
 * @param {string} phone The phone number of the recipient.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs during the API call.
 */
const addShippingAddressService = async (
  cartId,
  versionId,
  firstName,
  lastName,
  streetName,
  country,
  city,
  postalCode,
  phone
) => {
  try {
    console.log(
      cartId,
      versionId,
      firstName,
      lastName,
      streetName,
      country,
      city,
      postalCode,
      phone
    );
    const result = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: parseInt(versionId),
          actions: [
            {
              action: 'setShippingAddress',
              address: {
                firstName,
                lastName,
                streetName,
                country,
                city,
                postalCode,
                phone,
              },
            },
          ],
        },
      })
      .execute();
    return result.body;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves a cart specified by its ID.
 *
 * @param {string} cartId The ID of the cart.
 * @returns {Promise<Object>} The cart.
 * @throws {Error} If an error occurs during the API call.
 */

const getCartByIdService = async (cartId) => {
  try {
    const result = await apiRoot.carts().withId({ ID: cartId }).get().execute();
    console.log(result);
    return result.body;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Changes the quantity of a line item in a cart.
 *
 * @param {string} cartId The ID of the cart.
 * @param {string} versionId The version ID of the cart.
 * @param {string} lineItemId The ID of the line item.
 * @param {number} quantity The new quantity for the line item.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs during the API call.
 */
const changeLineItemsQtyService = async (
  cartId,
  versionId,
  lineItemId,
  quantity
) => {
  try {
    console.log(cartId, versionId, lineItemId, quantity, 'this is arguments');

    const result = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: parseInt(versionId),
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId: lineItemId,
              quantity,
            },
          ],
        },
      })
      .execute();
    return result.body;
  } catch (error) {
    console.log(error);
  }
};

const addShippingMethodForUserService = async (
  cartId,
  versionId,
  shippingMethodId
) => {
  try {
    const result = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: parseInt(versionId),
          actions: [
            {
              action: 'setShippingMethod',
              shippingMethod: {
                id: shippingMethodId,
                typeId: 'shipping-method',
              },
            },
          ],
        },
      })
      .execute();
    return result.body;
  } catch (error) {
    console.log(error);
  }
};

const addBilligAddressService = async (
  cartId,
  versionId,
  firstName,
  lastName,
  streetName,
  country,
  city,
  postalCode,
  phone
) => {
  try {
    console.log(
      cartId,
      versionId,
      firstName,
      lastName,
      streetName,
      country,
      city,
      postalCode,
      phone
    );
    const result = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: parseInt(versionId),
          actions: [
            {
              action: 'setBillingAddress',
              address: {
                firstName,
                lastName,
                streetName,
                country,
                city,
                postalCode,
                phone,
              },
            },
          ],
        },
      })
      .execute();
    return result.body;
  } catch (error) {
    console.log(error);
  }
};

const getTotalCartItemsService = async (cartId) => {
  try {
    const result = await apiRoot.carts().withId({ ID: cartId }).get().execute();
    return result.body;
  } catch (error) {
    console.log(error);
  }
};

const generateOrderByCartService = async (cartId, versionId) => {
  try {
    const cryptoNumer=crypto.randomInt(10 ** 7, 10 ** 10 - 1)
    console.log('this is cartid,verison id', cartId, versionId);
    const result = await apiRoot
      .orders()
      .post({
        body: {
          cart: {
            id: cartId,
            typeId: 'cart',
          },
          version: parseInt(versionId),
          orderNumber: `${cryptoNumer}`,
        },
      })
      .execute();
    console.log(result);

    return result.body;
  } catch (error) {
    console.log(error);
  }
};

const decodeTokenService = async (token) => {
  try {
    const result = await apiRoot
      .me()
      .get({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getOrderListService = async (email) => {
  try {
    const result = await apiRoot
      .orders()
      .get({
        queryArgs: {
          where: `customerEmail="${email}"`,
        },
      })
      .execute();
    console.log(result, 'this is result');
    return result;
  } catch (error) {
    console.log(error);
  }
};

// Export the functions for external use
module.exports = {
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
};
