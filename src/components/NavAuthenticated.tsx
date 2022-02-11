import { useRouter } from 'next/router'

import { useAuth } from 'src/context/auth-context'
import { useUser } from 'src/context/user-context'
import Avatar from './Avatar'
import { Menu, MenuList, MenuButton, MenuItem } from './Menu'

export default function NavAuthenticated() {
  const router = useRouter()
  const auth = useAuth()
  const user = useUser()

  if (auth.loading || user.loading) {
    return <>...</>
  }

  if (!user.data) {
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
    ? name.substring(name.indexOf(' ') + 1, name.indexOf(' ') + 2)
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
        <MenuItem onSelect={() => router.push('/set-location')}>
          Your Location
        </MenuItem>
        {roles.includes('ADMIN') && (
          <MenuItem onSelect={() => router.push('/admin')}>Admin</MenuItem>
        )}
        <MenuItem onSelect={auth.logout}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  )
}
