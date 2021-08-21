import { useEffect } from 'react'
import { Provider as AuthProvider, useSession, signIn } from 'next-auth/client'
import { ApolloProvider } from '@apollo/client'

import { useApollo } from '@/lib/graphql/apollo'
import { Session } from '@/lib/session'
import Loading from '@/components/Loading'
import ErrorPage from '@/components/ErrorPage'
import ProfileEdit from './account'

import 'normalize.css'
import '@/styles/global.scss'

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
    <AuthProvider session={pageProps.session}>
      <ApolloProvider client={client}>
        <ProfileCheck>
          <Page />
        </ProfileCheck>
      </ApolloProvider>
    </AuthProvider>
  )
}

function ProfileCheck({ children }) {
  const [session, loading] = useSession()
  const extSession: Session = session
  const isUser = !!session?.user
  const hasIdentity = !!extSession?.user.identity

  if (loading || !isUser || hasIdentity) return children

  return <ProfileEdit />
}

/**
 * Wrapper component for session requirement to access child components
 */
function Auth({ children }) {
  const [session, loading] = useSession()
  const isUser = !!session?.user

  useEffect(() => {
    if (loading) return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, loading])

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <Loading fullscreen />
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

/**
 * Wrapper component for ADMIN role authorization access for child components
 * @example Use of authorization requirement at /pages/admin
 * @see https://next-auth.js.org/getting-started/client#alternatives
 */
function Admin({ children }) {
  const [session_] = useSession()
  const session: Session = session_
  const isAdmin = !!session?.user?.roles?.includes('ADMIN')
  console.log(
    'Check Admin',
    session,
    'roles',
    session?.user?.roles,
    'isAdmin',
    isAdmin
  )

  if (isAdmin) {
    return children
  }

  return <Unauthorized />
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
