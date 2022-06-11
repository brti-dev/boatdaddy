import { Button } from 'matterial'
import { useRouter } from 'next/router'
import * as React from 'react'

import { UserUpdateInput_input } from 'interfaces/api/user'
import { useUser } from 'context/user-context'
import graphQlFetch from 'api/graphql/fetch'
import Layout from 'components/Layout'
import Map from 'components/Map'
import classes from 'styles/map.module.scss'
import ErrorPage from 'components/ErrorPage'

type UserUpdate_data = {
  id: number
}

const USER_UPDATE_MUTATION = `
  mutation userUpdate($id: Int!, $input: UserUpdateInput!) {
    userUpdate(id: $id, input: $input) {
      id
    }
  }
`

const updateUserData = async (vars: UserUpdateInput_input) => {
  const userUpdateRes = await graphQlFetch<
    UserUpdate_data,
    UserUpdateInput_input
  >(USER_UPDATE_MUTATION, vars)

  return userUpdateRes
}

export default function SetLocation() {
  const user = useUser()
  const router = useRouter()

  const [state, setState] = React.useState({
    latitude: user.data.latitude,
    longitude: user.data.longitude,
    moving: false,
    loading: false,
    error: null,
  })

  React.useEffect(() => console.log(state), [state])

  const submitLoc = () => {
    setState(s => ({ ...s, loading: true }))
    updateUserData({
      id: user.data.id,
      input: { latitude: state.latitude, longitude: state.longitude },
    })
      .then(_ => {
        router.push(`/@${user.data.username}`)
      })
      .catch(error => {
        console.error(error)
        setState(s => ({ ...s, error: String(error) }))
      })
      .finally(() => {
        setState(s => ({ ...s, loading: false }))
      })
  }

  if (state.error) {
    return <ErrorPage message="Something went wrong :(" />
  }

  return (
    <Layout title="Set your location" showFooter={false}>
      <div className={classes.map}>
        <Map
          latitude={state.latitude}
          longitude={state.longitude}
          onMove={newState =>
            setState({
              ...state,
              latitude: newState.latitude,
              longitude: newState.longitude,
              moving: true,
            })
          }
          onChange={() => {
            setState(s => ({ ...s, moving: false }))
          }}
        >
          <div
            className={`${classes.marker_center} ${
              state.moving && classes.marker_center_moving
            }`}
          >
            {user.data.profile.isBoatDaddy ? '🛥️' : '📍'}
          </div>
          <div className={classes.footer}>
            <Button
              variant="contained"
              color="primary"
              onClick={submitLoc}
              loading={state.loading}
            >
              Confirm Location
            </Button>
          </div>
        </Map>
      </div>
    </Layout>
  )
}

SetLocation.auth = true
