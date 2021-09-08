import type { AppProps /*, AppContext */ } from 'next/app'

import AppProviders from 'src/context'

import 'normalize.css'
import 'styles/global.scss'

/**
 * @prop Component - The active page; when navigating between routes, Component will change to the new page. Therefore, any props you send to Component will be received by the page.
 * @prop pageProps - An object with the initial props that were preloaded for your page by one of Nextjs data fetching methods, otherwise it's an empty object.
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
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

// /**
//  * Wrapper component for session requirement to access child components
//  */
// function Auth({ children }) {
//   const [session, loading] = useSession()
//   const isUser = !!session?.user

//   useEffect(() => {
//     if (loading) return // Do nothing while loading
//     if (!isUser) signIn() // If not authenticated, force log in
//   }, [isUser, loading])

//   if (isUser) {
//     return children
//   }

//   // Session is being fetched, or no user.
//   // If no user, useEffect() will redirect.
//   return <Loading fullscreen />
// }

// function Unauthorized() {
//   console.warn('unauthorized')
//   return (
//     <ErrorPage
//       title="Not Authorized"
//       message="You aren't authorized to access this page"
//     />
//   )
// }

// /**
//  * Wrapper component for ADMIN role authorization access for child components
//  * @example Use of authorization requirement at /pages/admin
//  * @see https://next-auth.js.org/getting-started/client#alternatives
//  */
// function Admin({ children }) {
//   const [session_] = useSession()
//   const session: Session = session_
//   const isAdmin = !!session?.user?.roles?.includes('ADMIN')
//   console.log(
//     'Check Admin',
//     session,
//     'roles',
//     session?.user?.roles,
//     'isAdmin',
//     isAdmin
//   )

//   if (isAdmin) {
//     return children
//   }

//   return <Unauthorized />
// }

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
