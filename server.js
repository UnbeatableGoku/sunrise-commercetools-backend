const { ApolloServer } = require('@apollo/server');
const { typeDefs } = require('./src/schema/product-schema');
const { resolvers } = require('./src/resolver/product-resolver');
const { startStandaloneServer } = require('@apollo/server/standalone');

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at ${url}`);
})();
