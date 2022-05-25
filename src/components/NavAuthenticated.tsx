import { Menu, MenuList, MenuButton, MenuItem } from 'matterial'
import { useRouter } from 'next/router'

import { useAuth } from 'context/auth-context'
import { useUser } from 'context/user-context'
import { ProfileAvatar } from './Profile'

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

  const { username, roles } = user.data

  return (
    <Menu>
      <MenuButton as={ProfileAvatar} user={user.data}>
        {username}
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
