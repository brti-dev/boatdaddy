export default `fragment userData on User {
  id
  username
  email
  emailVerified
  image
  latitude
  longitude
  createdAt
  updatedAt
  profile {
    name
    birthday
    isBoatDaddy
    bio
    boatName
    aboutBoat
    boatImage
    createdAt
    updatedAt
  }
  roles
}`
