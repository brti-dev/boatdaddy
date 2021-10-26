import { useRouter } from 'next/router'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'
import { gql, useQuery } from '@apollo/client'

import { useAuth } from 'src/context/auth-context'
import { Profile } from 'src/graphql/generated/Profile'
import Avatar from './Avatar'

type ProfileQuery = { data?: Profile; loading?: any; error?: any }

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
  console.log('Nav auth data', auth.data)
  const router = useRouter()

  const { data, loading, error }: ProfileQuery = useQuery(PROFILE_QUERY, {
    variables: { username: auth.data.username },
  })

  if (loading) {
    return <>...</>
  }

  const signOut = () => {
    router.push('/logout')
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
        <MenuItem onSelect={() => router.push(`/users/${auth.data.userId}`)}>
          Profile
        </MenuItem>
        <MenuItem onSelect={() => router.push('/account')}>
          Account Settings
        </MenuItem>
        <MenuItem onSelect={() => signOut()}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  )
}
