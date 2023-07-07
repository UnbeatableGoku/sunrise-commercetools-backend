const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar JSON

  type Query {
    products: [Product]
    singleProduct(id: String!): Product
    searchProducts(query: String): [Product]
    searchSuggestion(keyword: String!): [Suggestion]
  }

  type Mutation {
    auth(token: String!): JSON
    verifyExistUser(email: String!, phoneNumber: String!): JSON
    createCustomer(tokenId: String!): JSON
  }

  type Suggestion {
    text: String
  }

  type Product {
    id: String
    name: Name
    slug: Name
    metaDescription: Name
    masterVariant: ProductVariant
    variants: [ProductVariant]
  }

  type ProductVariant {
    id: String
    images: [Image]
    prices: [Price]
    attributes: JSON
    sku: String
  }

  type Price {
    value: priceValue
  }
  type priceValue {
    centAmount: Int
    currencyCode: String
  }

  type Name {
    en: String
  }

  type Image {
    url: String
  }
`;

module.exports = { typeDefs };
