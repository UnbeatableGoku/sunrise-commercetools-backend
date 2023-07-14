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
const deleteSocialUserService = async (uid) => {
  try {
    const deleteSocialUser = await firebaseAuth.deleteUser(uid);
    return deleteSocialUser;
  } catch (error) {
    console.log(error);
  }
};
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
              quantity: 1,
            },
          ],
        },
      })
      .execute();
    console.log(updatedCart.body);
  } catch (error) {
    console.log(error);
  }
};

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
const addShippingAddressService = async (
  cartId,
  versionId,
  firstName,
  lastName,
  streetName,
  country,
  state,
  city,
  postalCode,
  phone
) => {
  try {
    console.log(cartId,
      versionId,
      firstName,
      lastName,
      streetName,
      country,
      city,
      postalCode,
      phone);
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
};
