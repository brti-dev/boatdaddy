import intervalToDuration from 'date-fns/intervalToDuration'
import formatDistance from 'date-fns/formatDistance'
import parseISO from 'date-fns/parseISO'

import { User } from 'src/interfaces/user'
import Button from './Button'
import ProfileImage from './ProfileImage'
import BoatImage from './BoatImage'
import Avatar from './Avatar'
import Map, { MapMarker } from './Map'
import classes from 'src/styles/profile.module.scss'

export function BoatAvatar({ user, ...rest }) {
  const {
    username,
    profile: { boatName = 'Boat', boatImage },
  } = user
  const firstInitial = boatName.slice(0, 1)

  return (
    <Avatar
      src={boatImage}
      alt={
        boatName
          ? String.fromCharCode(8220) + boatName + String.fromCharCode(8221)
          : `${username}'s Boat`
      }
      {...rest}
    >
      {firstInitial}
    </Avatar>
  )
}

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

export function ProfileAvatar({ user, ...rest }) {
  const {
    username,
    image,
    profile: { name },
  } = user
  const firstInitial = name.slice(0, 1)
  const secondInitial = name.includes(' ')
    ? name.substr(name.indexOf(' ') + 1, 1)
    : null
  const initials = `${firstInitial}${secondInitial}`

  return (
    <Avatar alt={username} src={image} {...rest}>
      {initials}
    </Avatar>
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
      {user.longitude && user.latitude ? (
        <div className={classes.map}>
          <Map latitude={user.latitude} longitude={user.longitude} zoom={12}>
            <MapMarker latitude={user.latitude} longitude={user.longitude}>
              <ProfileAvatar user={user} size={40} />
            </MapMarker>
          </Map>
        </div>
      ) : (
        <strong>Unknown location</strong>
      )}
      {user.profile.isBoatDaddy && (
        <div className={classes.hail}>
          <Button
            variant="contained"
            color="secondary"
            to={`/hail/@${user.username}`}
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
