import { useRouter } from 'next/router'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'

import { useAuth } from 'src/context/auth-context'
import { useUser } from 'src/context/user-context'
import Avatar from './Avatar'

export default function NavAuthenticated() {
  const auth = useAuth()
  const router = useRouter()
  const user = useUser()

  if (user.loading) {
    return <>...</>
  }

  if (user.error) {
    console.error('An error ocurred when fetching auth user', user.error)

    return <>?</>
  }

  const {
    username,
    image,
    roles,
    profile: { name },
  } = user.data

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
        {roles.includes('ADMIN') && (
          <MenuItem onSelect={() => router.push('/admin')}>Admin</MenuItem>
        )}
        <MenuItem onSelect={auth.logout}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  )
}
