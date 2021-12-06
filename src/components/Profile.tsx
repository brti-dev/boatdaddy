import intervalToDuration from 'date-fns/intervalToDuration'
import formatDistance from 'date-fns/formatDistance'
import parseISO from 'date-fns/parseISO'

import { User } from 'src/interfaces/user'
import Button from 'src/components/Button'
import ProfileImage from 'src/components/ProfileImage'
import BoatImage from 'src/components/BoatImage'
import classes from 'styles/profile.module.scss'

export type BoatNameProps = {
  children?: string | null
} & JSX.IntrinsicElements['q']

export function BoatName({ children: boatName, ...rest }: BoatNameProps) {
  return (
    <q className={classes.boatName} {...rest}>
      {boatName ?? 'Boat'}
    </q>
  )
}

function Profile({ user }: { user: User }) {
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
            🛥️ <BoatName>{user.profile.boatName}</BoatName>
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

export default Profile
