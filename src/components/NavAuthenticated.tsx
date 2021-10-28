import { useRouter } from 'next/router'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'
import { gql, useQuery } from '@apollo/client'

import { useAuth } from 'src/context/auth-context'
import {
  Profile_profile,
  Profile as ProfileQuery,
  ProfileVariables,
} from 'src/graphql/generated/Profile'
import Avatar from './Avatar'

const PROFILE_QUERY = gql`
  query Profile($username: String!) {
    profile(username: $username) {
      image
      name
    }
  }
`

export default function NavAuthenticated() {
  const auth = useAuth()
  const router = useRouter()

  const { username } = auth.data

  const { data, loading, error } = useQuery<ProfileQuery, ProfileVariables>(
    PROFILE_QUERY,
    {
      variables: { username },
    }
  )

  if (loading) {
    return <>...</>
  }

  const { image, name } = data.profile

  const firstInitial = name.slice(0, 1)
  const secondInitial = name.includes(' ')
    ? name.substr(name.indexOf(' ') + 1, 1)
    : null
  const initials = `${firstInitial}${secondInitial}`

  return (
    <Menu>
      <MenuButton as={Avatar} alt={name} src={image}>
        {initials}
      </MenuButton>
      <MenuList>
        <MenuItem onSelect={() => router.push('/rides')}>My Rides</MenuItem>
        <MenuItem onSelect={() => router.push(`/@${username}`)}>
          Profile
        </MenuItem>
        <MenuItem onSelect={() => router.push('/account')}>
          Account Settings
        </MenuItem>
        <MenuItem onSelect={auth.logout}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  )
}
