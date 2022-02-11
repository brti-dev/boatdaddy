import { useState } from 'react'
import { useRouter } from 'next/router'

import { UserUpdateInput_input } from 'src/interfaces/api/user'
import { useUser } from 'src/context/user-context'
import graphQlFetch from 'src/graphql/fetch'
import Layout from 'src/components/Layout'
import Map from 'src/components/Map'
import classes from 'src/styles/map.module.scss'
import Button from 'src/components/Button'
import ErrorPage from 'src/components/ErrorPage'

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
  console.log('Update user', vars)
  const userUpdateRes = await graphQlFetch<
    UserUpdate_data,
    UserUpdateInput_input
  >(USER_UPDATE_MUTATION, vars)

  return userUpdateRes
}

export default function SetLocation() {
  const user = useUser()
  const router = useRouter()

  const [state, setState] = useState({
    latitude: user.data.latitude,
    longitude: user.data.longitude,
    moving: false,
    loading: false,
    error: null,
  })

  const submitLoc = () => {
    setState(s => ({ ...s, loading: true }))
    updateUserData({
      id: user.data.id,
      input: { latitude: state.latitude, longitude: state.longitude },
    })
      .then(res => {
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
