const typeDefinitions = `

# = Comments

# enums can be used for argument type in queries and mutations
enum Roles {
  USER 
  ADMIN
  SUPER_ADMIN
}

enum MenuCategory {
  APPETIZER
  ENTRE
  SIDE
  DESERT
  DRINK
  UPSELL
}

# composable "output" types for query result and mutation result from db/api
#
# "!" means required and is necessary only in mutations (to validate user input
# is complete and with correct types.) That is unless you want to 
# return an error if a given field is not presebnt in db or api result. 

type Menu {
  entrees: [Item]
  sides: [Item]
  appetizers: [Item]
  deserts: [Item]
  drinks: [Item]
  upsells: [Item]
}

type Item {
  _id: String # Primary Key created by db, exposed so we can update/remove or fetch more/less
  itemDescription: String
  menuCategory: MenuCategory
  tags: [String] # soup, salad, hot, cold, meat, seafood, etc
  itemPrice: String 
  itemImageURL:  String
  sides: [Item]
  upsells: [Item]
}

type User {
  _id: String # Primary Key created by db, exposed so we can update/remove or fetch more/less
  roles: [Roles]
  firstName: String
  lastName: String
  username: String
  phoneNumber: String
  # password is part of the db model and is hashed by a 'before' hook in create() method
  # of the Users service
  favoriteItems: [Item] 
  orders: [Order]
  pendingOrders: [Order]
}

type Order {
  _id: String # Primary Key created by db, exposed so we can update/remove or fetch more/less
  # userId is also part of the db schema (not exposed here since it's redundant w/r/t author field)
  # and is generated by the Comments service 'before' hooks based on the authenticated entity
  user: User 
  items: [Item]
  total: String
  statusMessage: String
  comment: String
  fulfilled: Boolean
  createdAt: String
  updatedAt: String 
}

# output type for login mutation
type AuthPayload {
  token: String # JSON Web Token
  user: User
}

# composable input types for query and mutation arguments from client
#
# input types cannot reference output types but can reference other input types
#
# Just like how recursive relationship in output types are specified via
# nesting in the query (and mutation result), recursive relationships in input types have to be
# specified via nesting in the input
#
input orderInput {
  itemIds: [String!]!
  comment: String
}

input itemInput {
  itemDescription: String!
  menuCategory: MenuCategory!
  tags: [String] # soup, salad, hot, cold, meat, seafood, etc
  itemPrice: String! 
  itemImageURL: String
  sideIds: [String]
  upsellIds: [String]
}

# the schema allows the following root queries:
# the returned type from each root query can be refined further by selecting nested types
# role restricted queries require auth token
type RootQuery {
  viewer(webtoken: String!): User
  user(username: String!, webtoken: String!): User
  users(webtoken: String!): [User] 
  item(_id: String!): Item 
  items(menuCategory: MenuCategory): [Item] 
  allItems: [Item]
  order(_id: String!, webtoken: String!): Order 
  allOrders (webtoken: String!): [Order] 
  menu: Menu
}

# this schema allows the following root mutations:
# the returned type from each root mutation can be refined further by selecting nested types
# restricted mutations require auth token
type RootMutation {
  signUp (
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    roles: [Roles!]
  ): User

  logIn (
    username: String!
    password: String!
  ): AuthPayload

  createItem (
    item: itemInput
    webtoken: String!
  ): Item

  editItem (
    _id: String!
    item: itemInput
    webtoken: String!
  ): Item

  removeItem (
    _id: String!
    webtoken: String!
  ): Item

  createOrder (
    # userId is also part of the db schema for Comment
    # and is generated by the Orders service 'before' hooks based on the authenticated entity
    order: orderInput
    webtoken: String!
  ): Order

}

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: RootQuery
  mutation: RootMutation
}
`;

export default [typeDefinitions]
