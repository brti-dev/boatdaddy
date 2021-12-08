import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'

import { UserList_data, User } from 'src/interfaces/api/user'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'
import { AvatarGroup } from 'src/components/Avatar'
import { BoatAvatar, BoatName, ProfileAvatar } from 'src/components/Profile'
import classes from 'src/styles/daddies.module.scss'
import useMediaQuery from 'src/lib/use-media-query'

const DADDIES_QUERY = gql`
  query {
    userList(isBoatDaddy: true) {
      users {
        id
        username
        image
        createdAt
        profile {
          name
          birthday
          isBoatDaddy
          boatName
          boatImage
        }
      }
    }
  }
`

export default function Daddies() {
  const { data, error, loading } = useQuery<UserList_data>(DADDIES_QUERY)

  if (error)
    return <ErrorPage message={error.message ?? 'Something went wrong'} />

  return (
    <Layout title="Boat Daddies">
      <h1>Boat Daddies</h1>
      {!data || loading ? (
        <Loading />
      ) : (
        <DaddiesList users={data.userList.users} />
      )}
    </Layout>
  )
}

function DaddiesList({ users }) {
  const isMobile = useMediaQuery('(max-width:640px')
  const avatarSize = isMobile ? 40 : 80

  return (
    <ul className={classes.index}>
      {users.map(user => (
        <li key={user.id}>
          <Link href={`@${user.username}`}>
            <a className={classes.row}>
              <strong>{user.username}</strong>
              <AvatarGroup>
                <ProfileAvatar user={user} size={avatarSize} />
                <BoatAvatar user={user} size={avatarSize} />
              </AvatarGroup>
              <strong>
                <BoatName>{user.profile.boatName}</BoatName>
              </strong>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  )
}
