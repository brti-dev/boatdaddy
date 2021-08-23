import { useRouter } from 'next/router'
import intervalToDuration from 'date-fns/intervalToDuration'
import formatDistance from 'date-fns/formatDistance'
import parseISO from 'date-fns/parseISO'
import ContentLoader from 'react-content-loader'
import { useQuery, gql } from '@apollo/client'

import Layout from 'src/components/Layout'
import classes from 'styles/profile.module.scss'
import Button from 'src/components/Button'

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`

const PROFILE_QUERY = gql`
  query Profile {
    about
  }
`

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

function ProfileView({ profile }) {
  const birthday = parseISO(profile.birthday)
  const { years: age } = intervalToDuration({
    start: birthday,
    end: new Date(),
  })
  const memberSince = formatDistance(parseISO(profile.createdAt), new Date())

  return (
    <div className={classes.profile}>
      <div className={classes.heading}>
        <div className={classes.image}>
          {profile.image ? (
            <img src={profile.image} />
          ) : (
            <div className={classes.noImage}>👨</div>
          )}
        </div>
        <ul>
          <li>
            <strong>{profile.name}</strong>
          </li>
          <li>{age} years old</li>
          <li>Member for {memberSince}</li>
        </ul>
      </div>
      {profile.isDaddy && profile.bio && <p>{profile.bio}</p>}
      {profile.hasBoat && profile.aboutBoat && <p>{profile.aboutBoat}</p>}
      {profile.hasBoat && (
        <div>
          <Button
            variant="contained"
            color="secondary"
            to="/hail"
            className={classes.hailButton}
          >
            Hail a Ride with {profile.username}
          </Button>
        </div>
      )}
    </div>
  )
}

function Profile() {
  const { query } = useRouter()

  const username = query?.username?.slice(1)

  const result = useQuery(PROFILE_QUERY)
  console.log({ result })
  const { data, error, loading } = result
  const profile = data

  if (error) {
    console.error(error)

    return (
      <Layout>
        <h1>Oops</h1>
        <p>{error.message ?? 'Something went wrong'}</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <main>
        <h1>{username}</h1>
        {profile ? <ProfileView profile={profile} /> : <Loader />}
      </main>
    </Layout>
  )
}

export default Profile
