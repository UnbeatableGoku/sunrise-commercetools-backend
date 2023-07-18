const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, productSchema } = require('./src/schema/product-schema');
const {
  resolvers,
  productResolver,
} = require('./src/resolver/product-resolver');
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { userResolver } = require('./src/resolver/user-resolver');
const { userSchema } = require('./src/schema/user-schema');
const app = express();
const httpServer = http.createServer(app);

(async () => {
  const server = new ApolloServer({
    typeDefs: [userSchema, productSchema],
    resolvers: [productResolver, userResolver],
  });

  await server.start();
  app.use(cookieParser());

  app.use(
    '/',
    bodyParser.json({ limit: '50mb' }),
    cors({
      origin: [
        'http://localhost:3000',
        'https://sunrise-commercetools-frontend.vercel.app',
      ],
      credentials: true,
    }),

    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/`);
})();
