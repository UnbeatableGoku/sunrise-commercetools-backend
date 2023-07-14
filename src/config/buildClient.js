const fetch = require('node-fetch');
const { ClientBuilder } = require('@commercetools/sdk-client-v2');
const { projectKey } = require('../constant');
const { default: sdkAuth } = require('@commercetools/sdk-auth');
require('dotenv').config();

console.log(process.env.CTP_CLIENT_SECRET);

const authMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL,
  projectKey,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID,
    clientSecret: process.env.CTP_CLIENT_SECRET,
  },
  fetch,
};
const httpMiddlewareOptions = {
  host: process.env.CTP_API_URL,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

const authClient = new sdkAuth({
  host: process.env.CTP_AUTH_URL,
  projectKey,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID,
    clientSecret: process.env.CTP_CLIENT_SECRET,
  },
  fetch,
});
module.exports = { ctpClient, authClient };
