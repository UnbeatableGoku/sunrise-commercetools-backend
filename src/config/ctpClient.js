const { ctpClient } = require('./buildClient');
const { projectKey } = require('../constant');

const {
  createApiBuilderFromCtpClient,
} = require('@commercetools/platform-sdk');

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey,
});

module.exports = { apiRoot };
