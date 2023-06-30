const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar JSON
  type Query {
    products: [Product]
    singleProduct(id: String!): Product
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
    attributes:JSON
    sku:String
  }

  type Price {
    value: priceValue
  }
  type priceValue {
    centAmount: Int
    currencyCode:String
  }

  type Name {
    en: String
  }

  type Image {
    url: String
  }
`;

module.exports = { typeDefs };
