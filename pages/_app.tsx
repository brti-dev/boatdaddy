import { useEffect } from 'react'
import { Provider, useSession, signIn } from 'next-auth/client'

import { Session } from '@/lib/session'
import Loading from '@/components/Loading'
import ProfileEdit from './account'

import 'normalize.css'
import '@/styles/global.scss'

// Example use of authorization requirement at /pages/admin
// @see https://next-auth.js.org/getting-started/client#alternatives

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ProfileCheck>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </ProfileCheck>
    </Provider>
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
  return <Loading fullScreen />
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
