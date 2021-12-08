import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'

import { UserList_data, User } from 'src/interfaces/api/_user'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'
import { AvatarGroup } from 'src/components/Avatar'
import { BoatAvatar, BoatName, ProfileAvatar } from 'src/components/Profile'

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
  return (
    <ul
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1em',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {users.map(user => (
        <li key={user.id}>
          <Link href={`@${user.username}`}>
            <a
              style={{
                display: 'flex',
                gap: '1em',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <strong style={{ flex: 1, textAlign: 'right' }}>
                {user.username}
              </strong>
              <AvatarGroup>
                <ProfileAvatar user={user} size={80} />
                <BoatAvatar user={user} size={80} />
              </AvatarGroup>
              <strong style={{ flex: 1 }}>
                <BoatName>{user.profile.boatName}</BoatName>
              </strong>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  )
}
