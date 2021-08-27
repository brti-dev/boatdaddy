import { useRouter } from 'next/router'
import intervalToDuration from 'date-fns/intervalToDuration'
import formatDistance from 'date-fns/formatDistance'
import parseISO from 'date-fns/parseISO'
import ContentLoader from 'react-content-loader'
import { useQuery, gql } from '@apollo/client'
import { Image } from 'cloudinary-react'

import {
  Profile_profile,
  Profile as ProfileQuery,
  ProfileVariables,
} from 'src/graphql/generated/Profile'
import Layout from 'src/components/Layout'
import Button from 'src/components/Button'
import ErrorPage from 'src/components/ErrorPage'
import classes from 'styles/profile.module.scss'

const PROFILE_QUERY = gql`
  query Profile($username: String!) {
    profile(username: $username) {
      aboutBoat
      bio
      birthday
      boatImage
      createdAt
      hasBoat
      image
      isDaddy
      name
      updatedAt
      userId
      username
    }
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

function ProfileView({ profile }: { profile: Profile_profile }) {
  let birthday = parseISO(profile.birthday)
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
    memberSince = formatDistance(parseISO(profile.createdAt), new Date())
  } catch (error) {
    memberSince = '?'
  }

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
          <li>{age ?? '?'} years old</li>
          <li>Member for {memberSince}</li>
        </ul>
      </div>
      {profile.isDaddy && profile.bio && (
        <>
          <h2>👨 Bio</h2>
          <p>{profile.bio}</p>
        </>
      )}
      {profile.hasBoat && profile.aboutBoat && (
        <>
          <h2>🛥️ Boat</h2>
          <p>{profile.aboutBoat}</p>
        </>
      )}
      {profile.hasBoat && profile.boatImage && (
        <Image
          className="fuu"
          cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
          publicId={profile.userId}
          secure
          alt={profile.username}
          dpr="auto"
          quality="auto"
          width={900}
          height={Math.floor((9 / 16) * 900)}
          gravity="auto"
        />
      )}
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

  const username = query?.username?.slice(1) as string

  if (!username) {
    return null
  }

  const result = useQuery<ProfileQuery, ProfileVariables>(PROFILE_QUERY, {
    variables: { username },
  })
  console.log({ result })
  const { data, error, loading } = result

  if (error) {
    console.error(error)

    return <ErrorPage title="Oops" message="Something went wrong" />
  }

  return (
    <Layout>
      <main>
        <h1>{username}</h1>
        {data?.profile ? <ProfileView profile={data.profile} /> : <Loader />}
      </main>
    </Layout>
  )
}

export default Profile
