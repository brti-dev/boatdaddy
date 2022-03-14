import DriverCard from 'components/DriverCard'
import { User } from 'interfaces/user'

const user: User = {
  id: 1,
  email: 'jd@boatdaddy.app',
  username: 'john_daddy',
  roles: ['DRIVER'],
  createdAt: new Date(2021, 6, 1),
  updatedAt: new Date(2022, 1, 1),
  latitude: 41.49,
  longitude: -73.45,
  image: 'cloudinaryPublicId=cat_nypajx.png',
  profile: {
    boatName: 'Stugots',
    name: 'John Daddy',
    isBoatDaddy: true,
    // boatImage: 'cloudinaryPublicId=damian-barczak-p-GrqI8OSqI-unsplash_fnv5lo.jpg',
  },
}

function DriverCardComponent() {
  return <DriverCard user={user} />
}

export default DriverCardComponent
