import { useRouter } from 'next/router'
import intervalToDuration from 'date-fns/intervalToDuration'
import formatDistance from 'date-fns/formatDistance'
import parseISO from 'date-fns/parseISO'
import ContentLoader from 'react-content-loader'

import { User } from 'src/interfaces/user'
import { getUser } from 'src/user'
import Layout from 'src/components/Layout'
import Button from 'src/components/Button'
import ErrorPage from 'src/components/ErrorPage'
import ProfileImage from 'src/components/ProfileImage'
import BoatImage from 'src/components/BoatImage'
import classes from 'styles/profile.module.scss'

const Loader = () => (
  <ContentLoader
    speed={2}
    width={350}
    height={300}
    viewBox="0 0 350 300"
    // backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <circle cx="60" cy="60" r="60" />
    <rect x="140" y="20" rx="3" ry="3" width="140" height="10" />
    <rect x="140" y="50" rx="2" ry="2" width="140" height="10" />
    <rect x="140" y="80" rx="2" ry="2" width="140" height="10" />
    <rect x="208" y="212" rx="0" ry="0" width="1" height="0" />
    <rect x="0" y="137" rx="0" ry="0" width="350" height="150" />
  </ContentLoader>
)

function ProfileView({ user }: { user: User }) {
  let birthday = parseISO(user.profile.birthday)
  let age: number
  try {
    const { years } = intervalToDuration({
      start: birthday,
      end: new Date(),
    })
    age = years
  } catch (error) {
    age = 0
  }

  let memberSince: string
  try {
    memberSince = formatDistance(parseISO(user.createdAt), new Date())
  } catch (error) {
    memberSince = '?'
  }

  return (
    <div className={classes.profile}>
      <div className={classes.heading}>
        <ProfileImage src={user.image} />
        <ul>
          <li>
            <strong>{user.profile.name}</strong>
          </li>
          <li>{age ?? '?'} years old</li>
          <li>Member for {memberSince}</li>
        </ul>
      </div>
      {user.profile.isBoatDaddy && user.profile.bio && (
        <>
          <h2>👨 Bio</h2>
          <p>{user.profile.bio}</p>
        </>
      )}
      {user.profile.isBoatDaddy && user.profile.aboutBoat && (
        <>
          <h2>
            🛥️{' '}
            {user.profile.boatName ? (
              <q className={classes.boatName}>{user.profile.boatName}</q>
            ) : (
              'Boat'
            )}
          </h2>
          <p>{user.profile.aboutBoat}</p>
        </>
      )}
      {user.profile.isBoatDaddy && user.profile.boatImage && (
        <BoatImage
          src={user.profile.boatImage}
          alt={`${user.username}'s boat`}
          dpr="auto"
          quality="auto"
          width={900}
          // height={Math.floor((9 / 16) * 900)}
          gravity="auto"
        />
      )}
      {user.profile.isBoatDaddy && (
        <div className={classes.hail}>
          <Button
            variant="contained"
            color="secondary"
            to="/hail"
            className={classes.hailButton}
          >
            Hail a Ride with {user.username}
          </Button>
        </div>
      )}
    </div>
  )
}

function ProfileLayout({ username }) {
  const { data, error, loading } = getUser({ username })

  if (error) {
    console.error(error)

    return <ErrorPage title="Oops" message="Something went wrong" />
  }

  return (
    <Layout>
      <main>
        <h1>{username}</h1>
        {!data || loading ? <Loader /> : <ProfileView user={data} />}
      </main>
    </Layout>
  )
}

function Profile() {
  const { query } = useRouter()

  const username = query?.username?.slice(1) as string

  if (!username) {
    return <ErrorPage title="Error" message="Please enter a username" />
  }

  return <ProfileLayout username={username} />
}

export default Profile
