export default `fragment userData on User {
  id
  username
  email
  emailVerified
  image
  createdAt
  updatedAt
  profile {
    name
    birthday
    isBoatDaddy
    bio
    aboutBoat
    boatImage
    createdAt
    updatedAt
  }
  roles
}`
