const { apiRoot } = require('../config/ctpClient');
const { firebaseAuth } = require('../config/firebseConfig');
/**
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

const addEmailToGuestUserOrderService = async (
  orderList,
  customerId,
) => {
  try {
    console.log('entering in the final stage ------------------------------');
    const orders =Promise.all( orderList.map(async (item) => {
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
    }));
    console.log(orders, 'this is oreders -------------------------');
    return orders;
  } catch (error) {
    console.log(error);
  }
};

// Export the functions for external use
module.exports = {
  createCustomerService,
  checkSocialUserService,
  updateUserEmailService,
  deleteSocialUserService,
  addEmailIdAsGuestUserService,
  addEmailToGuestUserOrderService,
};
