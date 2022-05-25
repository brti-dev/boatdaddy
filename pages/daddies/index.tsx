import { gql, useQuery } from '@apollo/client'
import { AvatarGroup, Button, Tooltip } from 'matterial'
import Link from 'next/link'

import { UserList_data } from 'interfaces/api/user'
import { useUser } from 'context/user-context'
import useMediaQuery from 'lib/use-media-query'
import Layout from 'components/Layout'
import ErrorPage from 'components/ErrorPage'
import Loading from 'components/Loading'
import { BoatName, ProfileAvatar } from 'components/Profile'
import { BiUserPlus as AddIcon } from 'react-icons/bi'
import classes from 'styles/daddies.module.scss'

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
  const user = useUser()

  if (error)
    return <ErrorPage message={error.message ?? 'Something went wrong'} />

  return (
    <Layout title="Boat Daddies">
      <header className={classes.header}>
        <h1>Boat Daddies</h1>
        {user?.data?.roles?.includes('ADMIN') && (
          <Tooltip label="Add a Daddy">
            <Button
              to="/daddies/add"
              variant="contained"
              shape="circle"
              color="primary"
            >
              <AddIcon />
            </Button>
          </Tooltip>
        )}
      </header>

      {!data || loading ? (
        <Loading />
      ) : (
        <DaddiesList users={data.userList.users} />
      )}
    </Layout>
  )
}

function DaddiesList({ users }) {
  const isMobile = useMediaQuery('(max-width:640px)')
  const avatarSize = isMobile ? 60 : 80

  return (
    <ul className={classes.index}>
      {users.map(user => (
        <li key={user.id}>
          <Link href={`@${user.username}`}>
            <a className={classes.row}>
              <AvatarGroup>
                <ProfileAvatar user={user} size={avatarSize} />
                <ProfileAvatar boat user={user} size={avatarSize} />
              </AvatarGroup>
              <strong>
                {user.username}
                <br />
                <BoatName>{user.profile.boatName}</BoatName>
              </strong>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  )
}
