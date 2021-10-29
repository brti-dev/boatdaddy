import { Profile as ProfileType } from '../user'

export type Profile_profile = {
  __typename: 'Profile'
} & ProfileType

export interface Profile {
  profile: Profile_profile | null
}

export interface ProfileVariables {
  username: string
}
