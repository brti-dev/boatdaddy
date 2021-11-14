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
    isDaddy
    bio
    hasBoat
    aboutBoat
    boatImage
    createdAt
    updatedAt
  }
  roles
}`
