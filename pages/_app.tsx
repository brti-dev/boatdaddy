import { useEffect, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { useRouter } from 'next/router'

import { UserUpdateInput_input } from 'interfaces/api/user'
import { useApollo } from 'api/graphql/apollo'
import { AuthProvider, useAuth } from 'context/auth-context'
import { UserProvider, useUser } from 'context/user-context'
import graphQlFetch from 'api/graphql/fetch'
import ErrorPage from 'components/ErrorPage'
import Layout from 'components/Layout'
import Dialog, { CloseButton } from 'components/Dialog'
import Loading from 'components/Loading'
import Button from 'components/Button'

import 'normalize.css'
import 'styles/global.scss'
import 'styles/custom.scss'
import classes from 'styles/nav.module.scss'

const DEFAULT_LAT = 41.49
const DEFAULT_LONG = -73.45

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
  console.log(userUpdateRes)
}

/**
 * @prop Component - The active page; when navigating between routes, Component will change to the new page. Therefore, any props you send to Component will be received by the page.
 * @prop pageProps - An object with the initial props that were preloaded for your page by one of Nextjs data fetching methods, otherwise it's an empty object.
 */
function MyApp({ Component, pageProps }) {
  const client = useApollo()

  const Page = () => {
    if (Component.auth) {
      return (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      )
    }

    if (Component.admin) {
      return (
        <Auth>
          <Admin>
            <Component {...pageProps} />
          </Admin>
        </Auth>
      )
    }

    return <Component {...pageProps} />
  }

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <UserProvider>
          <GeolocationChecker>
            <Page />
          </GeolocationChecker>
        </UserProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}

/**
 * Wrapper component for session requirement to access child components
 */
function Auth({ children }) {
  const { data: auth, loading: authLoading } = useAuth()
  const { data: user, loading: userLoading } = useUser()

  if (auth && user) {
    return children
  }

  if (authLoading || userLoading) {
    return <Loading fullscreen />
  }

  return (
    <Layout title="Please sign in">
      <p>Please sign in to continue</p>
    </Layout>
  )
}

/**
 * Wrapper component for ADMIN role authorization access for child components
 * @example Use of authorization requirement at /pages/admin
 */
function Admin({ children }) {
  const { data } = useAuth()
  const isAdmin = !!data?.roles?.includes('ADMIN')
  console.log('Check Admin', data, 'roles', data?.roles, 'isAdmin', isAdmin)

  if (isAdmin) {
    return children
  }

  return <Unauthorized />
}

function Unauthorized() {
  console.warn('unauthorized')
  return (
    <ErrorPage
      title="Not Authorized"
      message="You aren't authorized to access this page"
    />
  )
}

function GeolocationChecker({ children }) {
  const { data, geolocationAsk } = useAuth()
  const router = useRouter()

  const [open, setOpen] = useState(geolocationAsk.current)

  useEffect(() => {
    setOpen(geolocationAsk.current)
  }, [geolocationAsk.current])

  const setLoc = (method: 'auto' | 'manual' | 'default') => {
    geolocationAsk.current = false
    setOpen(false)

    if (method == 'auto') {
      if (!navigator.geolocation) {
        console.warn(
          'Geolocation is not supported by current browser; Using default position'
        )
        updateUserData({
          id: data.userId,
          input: { latitude: DEFAULT_LAT, longitude: DEFAULT_LONG },
        })
      } else {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords
            updateUserData({
              id: data.userId,
              input: { latitude, longitude },
            })
          },
          () => {
            console.error(
              'Unable to retrieve your location; Using default position'
            )
            updateUserData({
              id: data.userId,
              input: { latitude: DEFAULT_LAT, longitude: DEFAULT_LONG },
            })
          }
        )
      }
    } else if (method == 'manual') {
      updateUserData({
        id: data.userId,
        input: { latitude: DEFAULT_LAT, longitude: DEFAULT_LONG },
      })

      router.push('/set-location')
    } else {
      updateUserData({
        id: data.userId,
        input: { latitude: DEFAULT_LAT, longitude: DEFAULT_LONG },
      })
    }
  }

  return (
    <>
      <Dialog
        isOpen={open}
        onDismiss={() => setLoc('default')}
        className={classes.dialog}
        aria-label="set your location"
      >
        <CloseButton onClick={() => setLoc('default')} />

        <h2 className={classes.heading}>Welcome Back</h2>
        <p>We use your location to pair you with nearby riders and drivers.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setLoc('auto')}
          >
            Find my current location for me
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setLoc('manual')}
          >
            Set my location manually
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setLoc('default')}
          >
            Don't use my location
          </Button>
        </div>
      </Dialog>
      {children}
    </>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp
