const userSchema = `#graphql

    scalar JSON

    type Query {
        verifyUserByTokenId:JSON
    }

    type Mutation {
    auth(token: String!): JSON
    verifyExistUser(email: String!, phoneNumber: String!): JSON
    createCustomer(tokenId: String!): JSON
    verifySocialUser(token:String!):JSON
    generateToken(token:String!):JSON
    addEmailIdAsGuest(cartId:String!,versionId:String!,email:String!):JSON
    }
`;

module.exports = { userSchema };

