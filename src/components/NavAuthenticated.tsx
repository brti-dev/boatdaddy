import { useRouter } from 'next/router'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'

import { useAuth } from 'src/context/auth-context'
import Avatar from './Avatar'

export default function NavAuthenticated() {
  const auth = useAuth()
  console.log('Nav auth data', auth.data)
  const router = useRouter()

  const signOut = () => {
    router.push('/logout')
  }

  const image = null

  const name = auth.data.name

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
        <MenuItem onSelect={() => router.push(`/users/${auth.data.id}`)}>
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
