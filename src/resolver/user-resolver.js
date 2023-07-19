const { authClient } = require("../config/buildClient");
const { firebaseAuth } = require("../config/firebseConfig");
const jwt = require("jsonwebtoken");
const {
  decodeTokenService,
  getOrderListService,
} = require("../services/product-service");
const {
  createCustomerService,
  checkSocialUserService,
  deleteSocialUserService,
  updateUserEmailService,
  addEmailIdAsGuestUserService,
  addEmailToGuestUserOrderService,
} = require("../services/user-service");

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

const verifyUserByToken = async (parent, args, { req, res }) => {
  try {
    console.log(req.cookies.token);
    const result = await decodeTokenService(req.cookies.token);
    if (result.statusCode === 200) {
      console.log("entering in getOrderList Service--------------------------");
      const orderList = await getOrderListService(result.body.email);
      if (orderList.statusCode === 200) {
        console.log(
          "entering in addEmaiiltogusetuserorder Service--------------------------"
        );
        const updatedOrderList = await addEmailToGuestUserOrderService(
          orderList.body.results,
          result.body.id
        );
        return updatedOrderList;
      }
      return orderList;
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

const userResolver = {
  Query: {
    verifyUserByTokenId: verifyUserByToken,
  },
  Mutation: {
    createCustomer: addNewCustomer,
    verifyExistUser: checkExistUser,
    generateToken: generateCustomerToken,
    verifySocialUser: checkSocialUser,
    addEmailIdAsGuest: addEmailIdAsGuestUser,
  },
};

module.exports = { userResolver };
