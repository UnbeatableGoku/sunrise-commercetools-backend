const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./src/schema/product-schema');
const { resolvers } = require('./src/resolver/product-resolver');

const server = new ApolloServer({ typeDefs, resolvers });

const initiatServer = async () => {
  const { url } = await server.listen();
  console.log('connected to ', url);
};

initiatServer();
