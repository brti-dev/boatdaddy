import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/client'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'

import { Session as SessionType } from 'src/session'
import Button from './Button'
import Avatar from './Avatar'

export default function Session() {
  const router = useRouter()

  const [session_, loading] = useSession()
  const session: SessionType = session_
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

  return <div id="session">{!session ? <SignIn /> : <SignedIn />}</div>
}
