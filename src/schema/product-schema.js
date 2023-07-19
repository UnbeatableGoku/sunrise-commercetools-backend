const productSchema = `#graphql

  scalar JSON

  

  type Cart {
    type:String
    id:String
    version:String
    versionModifiedAt:String
    lineItems:[LineItem]
    totalPrice:JSON
    shippingInfo:JSON
    taxedPrice:JSON
    totalLineItemQuantity:Int
  }

type LineItem{
  id:String
  productId:String
  productKey:String
  name:JSON
  variant:ProductVariant
  price:JSON
  attributes:[Attribute]
  quantity:Int
  
}


type Img{
url:String
dimensions:JSON
}

type Attribute{
name:String
value:String
}

  type Suggestion {
    text: String
  }

  input AddresInput{
    firstName:String
    lastName:String
    streetName:String
    country:String
    city:String
    postalCode:String
    phone:String
  }

  type Address{
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
    quantity:Int
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

  type Query {
    products: [Product]
    singleProduct(id: String!): Product
    searchProducts(query: String): [Product]
    searchSuggestion(keyword: String!): [Suggestion]
  }

  type CartResponse {
    id:ID!
    version:Int
    lineItems:[Product]
    customerEmail:String
    shippingAddress:Address
    billingAddress:Address
    taxedPrice:JSON
    totalGross:JSON
    totalPrice:JSON
    totalLineItemQuantity:Int
  }
  type Mutation {
    createCart(productId:String!):CartResponse
    addItemsToCart(productId:String!,cartId:String!,versionId:String!):CartResponse
    removeItemFromCart(lineItemId:String!,cartId:String!,versionId:String!):CartResponse
    changeCartItemsQty(cartId:String!,versionId:String!,lineItemId:String!,quantity:Int!):CartResponse
    addShippingAddress(addresInput:AddresInput!,cartId:String!,versionId:String!):JSON
    getCartById(cartId:String!):JSON
    addShippingMethod(cartId:String!,versionId:String!,shippingMethodId:String!):JSON
    addBillingAddress(addresInput:AddresInput!,cartId:String!,versionId:String!):JSON
    getCartItems(cartId:String!):JSON
    generateOrderByCartID(cartId:String!,versionId:String!):JSON
  }
`;

module.exports = { productSchema };
