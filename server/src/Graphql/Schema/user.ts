export const usertypeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
  }

     type AuthPayload {
    token: String!
    user: User!
  }
    type Mutation{
    registerUser(name:String!,email:String!,password:String!):AuthPayload!
    loginUser(email:String!,password:String!):AuthPayload!
    }
`;