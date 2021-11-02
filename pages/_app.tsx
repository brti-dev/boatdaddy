import { useEffect } from 'react'
import { ApolloProvider } from '@apollo/client'
import { useRouter } from 'next/router'

import { useApollo } from 'src/graphql/apollo'
import { AuthProvider, useAuth } from 'src/context/auth-context'
import { UserProvider } from 'src/context/user-context'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'

import 'normalize.css'
import 'styles/global.scss'

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
          <Page />
        </UserProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}

/**
 * Wrapper component for session requirement to access child components
 */
function Auth({ children }) {
  const router = useRouter()
  const { data } = useAuth()

  useEffect(() => {
    if (!data) router.push('/login') // If not authenticated, force log in
  }, [data])

  if (data) {
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

// function signIn() {}

// function useSession() {
//   return []
// }

// function AuthProvider({ session, children }) {
//   return children
// }

// function MyApp_Old({ Component, pageProps }) {
//   const client = useApollo()

//   const Page = () => {
//     if (Component.auth) {
//       return (
//         <Auth>
//           <Component {...pageProps} />
//         </Auth>
//       )
//     }

//     if (Component.admin) {
//       return (
//         <Auth>
//           <Admin>
//             <Component {...pageProps} />
//           </Admin>
//         </Auth>
//       )
//     }

//     return <Component {...pageProps} />
//   }

//   return (
//     <AuthProvider session={pageProps.session}>
//       <ApolloProvider client={client}>
//         <ProfileCheck>
//           <Page />
//         </ProfileCheck>
//       </ApolloProvider>
//     </AuthProvider>
//   )
// }

// function ProfileCheck({ children }) {
//   const [session, loading] = useSession()
//   const extSession: Session = session
//   const isUser = !!session?.user
//   const hasIdentity = !!extSession?.user.identity

//   if (loading || !isUser || hasIdentity) return children

//   return <ProfileEdit />
// }

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
