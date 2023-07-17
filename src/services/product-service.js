const { apiRoot } = require('../config/ctpClient');
const { v4: uuidv4, version } = require('uuid');
const { firebaseAuth } = require('../config/firebseConfig');
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
 * Creates a new customer with the provided email and phone number.
 *
 * @param {string} email The email of the new customer.
 * @param {string} phoneNumber The phone number of the new customer.
 * @returns {Promise<Object>} The newly created customer.
 * @throws {Error} If an error occurs during the API call.
 */
const createCustomerService = async (email, phoneNumber = '', name) => {
  try {
    const result = await apiRoot
      .me()
      .signup()
      .post({
        body: {
          email: email,
          password: email,
          firstName: name,
          custom: {
            type: {
              key: 'customer-mobile-no',
              typeId: 'type',
            },
            fields: {
              phoneNo: { en: phoneNumber },
            },
          },
        },
      })
      .execute();
    return result.body.customer;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Checks if a user with the given email exists and determines the number of authentication providers associated with that user.
 *
 * @param {string} email The email of the user to check.
 * @returns {Promise<number>} The number of authentication providers associated with the user.
 * @throws {Error} If an error occurs during the API call.
 */
const checkSocialUserService = async (email) => {
  try {
    const userWithEmail = await firebaseAuth.getUserByEmail(email);
    console.log(userWithEmail, 'this is updated user ');
    if (userWithEmail.providerData.length === 1) {
      return 1;
    } else if (userWithEmail.providerData.length > 1) {
      return 2;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Updates the email of a user identified by their unique ID.
 *
 * @param {string} uid The unique ID of the user.
 * @param {string} email The new email for the user.
 * @returns {Promise<Object>} The updated user.
 * @throws {Error} If an error occurs during the API call.
 */
const updateUserEmailService = async (uid, email) => {
  try {
    const updatedUser = await firebaseAuth.updateUser(uid, {
      email,
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Deletes a user identified by their unique ID.
 *
 * @param {string} uid The unique ID of the user to delete.
 * @returns {Promise<Object>} The deleted user.
 * @throws {Error} If an error occurs during the API call.
 */
const deleteSocialUserService = async (uid) => {
  try {
    const deleteSocialUser = await firebaseAuth.deleteUser(uid);
    return deleteSocialUser;
  } catch (error) {
    console.log(error);
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
 * Adds an email ID to a guest user's cart.
 *
 * @param {string} cartId The ID of the cart.
 * @param {string} versionId The version ID of the cart.
 * @param {string} email The email ID to add.
 * @returns {Promise<Object>} The updated cart.
 * @throws {Error} If an error occurs during the API call.
 */
const addEmailIdAsGuestUserService = async (cartId, versionId, email) => {
  try {
    const result = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: parseInt(versionId),
          actions: [
            {
              action: 'setCustomerEmail',
              email,
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
    return result;
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

const generateOrderByCartService = async (cartId, versionID) => {
  try {
    const result = await apiRoot
      .orders()
      .post({
        body: {
          cart: {
            id: cartId,
            typeId: 'cart',
          },
          version: parseInt(versionID),
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

const addEmailToGuestUserOrderService = async (orderList, customerId) => {
  try {
    const result = await apiRoot
      .customers()
      .get({
        queryArgs: {
          where: `email="pandyaprathmesh360@gmail.com"`,
        },
      })
      .execute();
    if (result.statusCode === 200) {
      console.log("entering in the final stage ------------------------------");
      const orders = orderList.map(async (item) => {
        const addEmail = await apiRoot
          .orders()
          .withId({ ID: item.id })
          .post({
            body: {
              version: parseInt(item.version),
              actions: [
                {
                  action: 'setCustomerId',
                  customerId,
                },
              ],
            },
          })
          .execute();
          console.log(addEmail);
        return addEmail;
      });
      console.log(orders,"this is oreders -------------------------");
      return orders;
    }
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
  createCustomerService,
  checkSocialUserService,
  updateUserEmailService,
  deleteSocialUserService,
  addFirstItemToCartService,
  addLineItemsService,
  removeCartItemService,
  addEmailIdAsGuestUserService,
  addShippingAddressService,
  getCartByIdService,
  changeLineItemsQtyService,
  addShippingMethodForUserService,
  addBilligAddressService,
  getTotalCartItemsService,
  generateOrderByCartService,
  decodeTokenService,
  getOrderListService,
  addEmailToGuestUserOrderService,
};
