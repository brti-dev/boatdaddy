import { ApolloProvider } from '@apollo/client'
import { Button, Container, Dialog } from 'matterial'
import type { AppProps /*, AppContext */ } from 'next/app'
import { useRouter } from 'next/router'
import * as React from 'react'

import { UserUpdateInput_input } from 'interfaces/api/user'
import { RequiredChildren } from 'interfaces/children'
import { useApollo } from 'api/graphql/apollo'
import { AuthProvider, useAuth } from 'context/auth-context'
import { UserProvider, useUser } from 'context/user-context'
import graphQlFetch from 'api/graphql/fetch'
import ErrorPage from 'components/ErrorPage'
import Layout from 'components/Layout'
import Loading from 'components/Loading'

import 'normalize.css'
import 'matterial/styles/global.scss'
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

const updateUserData = (vars: UserUpdateInput_input) =>
  graphQlFetch<UserUpdate_data, UserUpdateInput_input>(
    USER_UPDATE_MUTATION,
    vars
  )

export default function App({ Component: Component_, pageProps }: AppProps) {
  const Component = Component_ as any
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
function Auth({ children }: RequiredChildren): JSX.Element {
  const { data: auth, loading: authLoading } = useAuth()
  const { data: user, loading: userLoading } = useUser()

  if (auth && user) {
    return children as JSX.Element
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
function Admin({ children }: RequiredChildren): JSX.Element {
  const { data } = useAuth()
  const isAdmin = !!data?.roles?.includes('ADMIN')
  console.log('Check Admin', data, 'roles', data?.roles, 'isAdmin', isAdmin)

  if (isAdmin) {
    return children as JSX.Element
  }

  return <Unauthorized />
}

function Unauthorized(): JSX.Element {
  console.warn('unauthorized')

  return (
    <ErrorPage
      title="Not Authorized"
      message="You aren't authorized to access this page"
    />
  )
}

function GeolocationChecker({ children }: RequiredChildren): JSX.Element {
  const { data, geolocationAsk } = useAuth()
  const router = useRouter()

  const [open, setOpen] = React.useState(geolocationAsk.current)

  // Backend set location
  const [error, setError] = React.useState<null | string>(null)

  React.useEffect(() => {
    setOpen(geolocationAsk.current)
  }, [geolocationAsk.current])

  const setLoc = (method: 'auto' | 'manual' | 'default') => {
    geolocationAsk.current = false
    setOpen(false)

    try {
      if (method == 'auto') {
        if (!navigator.geolocation) {
          setError(
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
              updateUserData({
                id: data.userId,
                input: { latitude: DEFAULT_LAT, longitude: DEFAULT_LONG },
              })
              setError(
                'Unable to retrieve your location; Using default position'
              )
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
    } catch (error) {
      console.error(error)
      setError(String(error))
    }
  }

  if (error) {
    return (
      <Dialog
        active
        onDismiss={() => setError(null)}
        className={classes.dialog}
        label="error"
        closable
      >
        <h2 className={classes.heading}>Error</h2>
        <p>{String(error)}</p>
        <Container style={{ alignItems: 'flex-end' }}>
          <Button onClick={() => setError(null)}>OK</Button>
        </Container>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog
        active={open}
        onDismiss={() => setLoc('default')}
        className={classes.dialog}
        label="set your location"
        closable
      >
        <h2 className={classes.heading}>Welcome Back</h2>
        <p>We use your location to pair you with nearby riders and drivers.</p>
        <Container style={{ alignItems: 'stretch' }}>
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
        </Container>
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
