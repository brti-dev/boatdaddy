/* tslint:disable */
export interface Profile_profile {
  __typename: 'Profile'
  aboutBoat: string | null
  bio: string | null
  birthday: any
  boatImage: string | null
  createdAt: any
  hasBoat: boolean
  image: string | null
  isDaddy: boolean
  name: string
  updatedAt: any
  userId: number
  username: string
}

export interface Profile {
  profile: Profile_profile | null
}

export interface ProfileVariables {
  username: string
}
