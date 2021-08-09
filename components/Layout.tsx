/* eslint-disable prefer-template */
import { useReducer } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/client'
import { SkipNavLink, SkipNavContent } from '@reach/skip-nav'
import '@reach/skip-nav/styles.css'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'

import { Session } from '@/lib/session'
import classes from '@/styles/layout.module.scss'
import Button from './Button'
import Avatar from './Avatar'

export const SITE_TITLE = 'Boat Daddy'

const PAGES = [
  { link: '/hail', title: 'Hail a Boat Daddy' },
  { link: '/about', title: 'About' },
  { link: '/privacy-policy', title: 'Policy' },
]

function Layout({ title = SITE_TITLE, showFooter = true, children }) {
  const router = useRouter()
  const { pathname, query } = router
  const pathnameRoot = pathname.split('/', 2).join('/')

  const currentPageIndex = PAGES.findIndex(page => page.link === pathnameRoot)
  const isCurrentPage = (link: string) => link === pathnameRoot

  const [session_, loading] = useSession()
  const session: Session = session_
  console.log('useSession', session, loading)

  // Manual sign in methods (Replaced by Next Auth)
  // // State of modals and forms
  // type SignInState = {
  //   opened: boolean
  //   loading: boolean
  //   show: 'signin' | 'signup'
  // }
  // type SignInNewState = {
  //   opened?: boolean
  //   loading?: boolean
  //   show?: 'signin' | 'signup'
  // }
  // const [signInState, setSignInState] = useReducer(
  //   (state: SignInState, newState: SignInNewState) => ({
  //     ...state,
  //     ...newState,
  //   }),
  //   { opened: false, loading: false, show: 'signin' }
  // )
  // const [Alert, setAlert] = useAlert(null)
  // const openSignIn = () => setSignInState({ opened: true })
  // const closeSignIn = () => setSignInState({ opened: false })

  // // Focus on first form element when the modal opens
  // const formFocusRef = useRef<HTMLInputElement>(null)

  // useEffect(() => {
  //   if (signInState.opened && formFocusRef.current) {
  //     formFocusRef.current.focus()
  //   }
  // }, [signInState])

  // const submitSignIn = async event => {
  //   event.preventDefault()

  //   setSignInState({ loading: true })
  //   setAlert(null)

  //   const form = {
  //     email: event.target.email.value,
  //   }
  //   console.log(form)

  //   const form = {
  //     username: event.target.email.value,
  //     password: event.target.password.value,
  //   }
  // }

  // const submitSignUp = async event => {
  //   event.preventDefault()

  //   setSignInState({ loading: true })
  //   setAlert(null)

  //   const signInForm = {
  //     username: event.target.email.value,
  //     password: event.target.password.value,
  //   }
  //   const signUpForm = {
  //     ...signInForm,
  //     attributes: {
  //       email: event.target.email.value,
  //       gender: event.target.gender.value,
  //       birthdate: event.target.birthdate.value,
  //       given_name: event.target.name.value,
  //       preferred_username: event.target.email.value,
  //       'custom:has_boat': event.target.has_boat.value,
  //     },
  //   }
  //   console.log({ signUpForm })
  // }

  const SignIn = () => (
    <Button onClick={() => signIn()} variant="contained" color="secondary">
      Sign In
    </Button>
    // <>
    //   <Button onClick={openSignIn} variant="contained" color="secondary">
    //     Sign In
    //   </Button>
    //   <Dialog
    //     isOpen={signInState.opened}
    //     onDismiss={closeSignIn}
    //     className="surface"
    //     aria-label="sign in"
    //     style={{ maxWidth: 500 }}
    //   >
    //     <button className="close-button" onClick={closeSignIn}>
    //       <VisuallyHidden>Close</VisuallyHidden>
    //       <span aria-hidden>×</span>
    //     </button>
    //     {signInState.show === 'signin' ? (
    //       <form method="post" className={classes.sessionForm}>
    //         <h2>Hello, Daddy</h2>
    //         <Alert />
    //         <label htmlFor="sessionform__email">Email</label>
    //         <input
    //           type="email"
    //           name="email"
    //           id="sessionform__email"
    //           required
    //           autoFocus
    //           ref={formFocusRef}
    //         />
    //         <label htmlFor="sessionform__password">Password</label>
    //         <input
    //           type="password"
    //           name="password"
    //           id="sessionform__password"
    //           required
    //         />
    //         <div className={classes.submitRow}>
    //           <Button
    //             type="submit"
    //             loading={signInState.loading}
    //             variant="contained"
    //             color="primary"
    //           >
    //             Sign In
    //           </Button>
    //           <Button
    //             onClick={() =>
    //               setSignInState({
    //                 show: 'signup',
    //               })
    //             }
    //           >
    //             Sign Up
    //           </Button>
    //         </div>
    //       </form>
    //     ) : (
    //       <form onSubmit={submitSignUp} className={classes.sessionForm}>
    //         <h2>Welcome, Daddy</h2>
    //         <Alert />
    //         <label htmlFor="sessionform__email">Email</label>
    //         <input
    //           type="email"
    //           name="email"
    //           id="sessionform__email"
    //           required
    //           autoFocus
    //           ref={formFocusRef}
    //         />
    //         <label htmlFor="sessionform__password">Password</label>
    //         <input
    //           type="password"
    //           name="password"
    //           id="sessionform__password"
    //           required
    //         />
    //         <label htmlFor="sessionform__name">Name</label>
    //         <input
    //           type="text"
    //           name="name"
    //           id="sessionform__name"
    //           required
    //           placeholder="Given name or nickname"
    //         />
    //         <label htmlFor="sessionform__birthdate">Birthday</label>
    //         <input
    //           type="date"
    //           name="birthdate"
    //           id="sessionform__birthdate"
    //           required
    //         />
    //         <div className={checkButtonContainerClass}>
    //           <CheckButton name="gender" value="male">
    //             👨 I'm a daddy
    //           </CheckButton>
    //           <CheckButton name="has_boat" value="true">
    //             🛥️ I have a boat
    //           </CheckButton>
    //         </div>
    //         <div className={classes.submitRow}>
    //           <Button
    //             type="submit"
    //             loading={signInState.loading}
    //             variant="contained"
    //             color="primary"
    //           >
    //             Sign Up
    //           </Button>
    //           <Button
    //             onClick={() =>
    //               setSignInState({
    //                 show: 'signin',
    //               })
    //             }
    //           >
    //             Sign In
    //           </Button>
    //         </div>
    //       </form>
    //     )}
    //   </Dialog>
    // </>
  )

  const SignedIn = () => (
    <Menu>
      <MenuButton
        as={Avatar}
        alt={session.user.name}
        src={session.user.image ?? null}
      >
        {session.user.name.slice(0, 1)}
      </MenuButton>
      <MenuList>
        <MenuItem onSelect={() => router.push('/rides')}>My Rides</MenuItem>
        <MenuItem
          onSelect={() => router.push(`/@${session.user.identity?.username}`)}
        >
          Profile
        </MenuItem>
        <MenuItem onSelect={() => router.push('/account')}>
          Account Settings
        </MenuItem>
        <MenuItem onSelect={() => signOut()}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  )

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="true"
        />
        <meta
          property="og:image"
          content="https://og-image.vercel.app/%F0%9F%9B%A5%EF%B8%8F%F0%9F%91%A8.png?theme=light&md=0&fontSize=350px"
        />
        <meta name="og:title" content={SITE_TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <SkipNavLink />
      <header id="top" className={classes.header}>
        <h1>
          <Link href="/">🛥️👨</Link>
        </h1>
        <div id="session">{!session ? <SignIn /> : <SignedIn />}</div>
      </header>
      <SkipNavContent />
      <main className={classes.main}>{children}</main>
      {showFooter && (
        <footer className={classes.footer}>
          <nav aria-label="Footer">
            <ul>
              {PAGES.map(({ link, title: pageTitle }) => (
                <li
                  key={link}
                  className={isCurrentPage(link) ? 'current' : undefined}
                >
                  <Link href={link}>{pageTitle}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div
            style={{
              lineHeight: 1.6,
              marginTop: '1em',
              fontSize: '80%',
            }}
          >
            &copy;2021 The Andas <span style={{ opacity: 0.33 }}>|</span>{' '}
            Maranda Cox, CEO <span style={{ opacity: 0.33 }}>|</span>{' '}
            <a href="https://mattberti.com">Matt Berti</a> production
          </div>
        </footer>
      )}
    </>
  )
}

export default Layout
