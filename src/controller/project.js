const { apiRoot } = require('../config/ctpClient');

const getProjectDetails = () => {
  return apiRoot.get().execute();
};

module.exports = { getProjectDetails };
