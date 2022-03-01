import * as React from 'react'
import intervalToDuration from 'date-fns/intervalToDuration'
import formatDistance from 'date-fns/formatDistance'
import parseISO from 'date-fns/parseISO'

import { User } from 'interfaces/user'
import Button from './Button'
import ProfileImage from './ProfileImage'
import BoatImage from './BoatImage'
import Avatar, { AvatarProps } from './Avatar'
import Map, { MapMarker } from './Map'
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

/**
 * An avatar of a user's profile image or their boat
 */
export const ProfileAvatar = React.forwardRef<
  HTMLDivElement,
  { alt?: string; boat?: boolean; size?: number; user: User } & Omit<
    AvatarProps,
    'alt'
  >
>((props, ref) => {
  const {
    alt,
    boat = false,
    user: {
      username,
      image,
      profile: { name, boatName = 'Boat', boatImage },
    },
    size = 40,
    ...rest
  } = props
  console.log('ProfileAvatar', props)

  let initials: string
  let label = alt || username
  let src = image

  if (boat) {
    src = boatImage
    initials = boatName.slice(0, 1)
    label =
      boatName !== 'Boat'
        ? String.fromCharCode(8220) + boatName + String.fromCharCode(8221)
        : `${username}'s Boat`
  } else {
    const firstInitial = name.slice(0, 1)
    const spaceIndex = name.indexOf(' ')
    const secondInitial =
      spaceIndex >= 0 ? name.substring(spaceIndex + 1, spaceIndex + 2) : null
    initials = `${firstInitial}${secondInitial}`
  }

  return (
    <ProfileImage
      alt={label}
      src={src}
      size={size}
      as={Avatar}
      ref={ref}
      {...rest}
    >
      {initials}
    </ProfileImage>
  )
})

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
