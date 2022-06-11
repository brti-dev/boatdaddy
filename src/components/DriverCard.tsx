import { Tooltip, Button, Icon } from 'matterial'
import * as React from 'react'

import { User } from 'interfaces/api/user'

import BoatImage from 'components/BoatImage'
import { ProfileAvatar, BoatName } from 'components/Profile'
import classes from 'styles/driver-card.module.scss'

export default function DriverCard({ user }: { user: User }) {
  const [{ active, hover }, setState] = React.useState({
    active: false,
    hover: false,
  })

  return (
    <div
      className={classes.driverCard}
      data-hover={hover}
      data-active={active}
      onMouseEnter={() => setState({ active, hover: true })}
      onMouseLeave={() => setState({ active: false, hover: false })}
      onClick={() => setState({ active: !active, hover })}
    >
      <header>
        <h5>{user.profile.name || user.username}</h5>
        <ProfileAvatar user={user} size={30} />
        <strong>
          <span>@</span>
          {user.username}
        </strong>
      </header>

      <dl>
        <dt>📍</dt>
        <dd>New York</dd>
        <dt>🛥️</dt>
        <dd>
          <BoatName>{user.profile.boatName}</BoatName>
        </dd>
      </dl>

      <div className={classes.boatImage} data-show-on-active="true">
        {user.profile.boatImage && (
          <BoatImage
            src={user.profile.boatImage}
            alt={`${user.username}'s boat`}
            width={200}
            height={133}
          />
        )}
      </div>

      <footer data-show-on-active="true">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          to={`/hail/?driver=${user.username}`}
        >
          Hail
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          to={`/@${user.username}`}
        >
          Profile
        </Button>
      </footer>
    </div>
  )
}
