const typeDefs = `#graphql

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
    verifySocialUser(token:String!):JSON
    generateToken(token:String!):JSON
    createCart(productId:String!):JSON
    addItemsToCart(productId:String!,cartId:String!,versionId:String!):JSON
    removeItemFromCart(lineItemId:String!,cartId:String!,versionId:String!):JSON
    addEmailIdAsGuest(cartId:String!,versionId:String!,email:String!):JSON
    addShippingAddress(shippingAddresInput:shippingAddress,cartId:String!,versionId:String!):JSON
    getCartById(cartId:String!):JSON
    changeCartItemsQty(cartId:String!,versionId:String!,lineItemId:String!,quantity:Int!):JSON
  }

  type Suggestion {
    text: String
  }

  input shippingAddress{
    firstName:String
    lastName:String
    streetName:String
    country:String
    city:String
    postalCode:String
    phone:String
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
