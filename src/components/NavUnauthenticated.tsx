import { useState, useEffect, useReducer, useRef } from 'react'
import { Dialog } from '@reach/dialog'
import { VisuallyHidden } from '@reach/visually-hidden'

import useAlert from 'src/lib/use-alert'
import { Form, SubmitRow } from './Form'
import Button from './Button'
import CheckButton, { checkButtonContainerClass } from './CheckButton'
import { useAuth, AuthBody } from 'src/context/auth-context'

const GoogleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z"
      fill="currentColor"
    />
  </svg>
)

// State of modals and forms

type SignInState = {
  opened: boolean
  loading: boolean
  show: 'signin' | 'signup'
}

type SignInNewState = {
  opened?: boolean
  loading?: boolean
  show?: 'signin' | 'signup'
}

function loadGoogleOauth(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Load OAuth Google client library
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_ID
    const globalWindow = window as any

    try {
      if (!clientId) {
        throw new Error('No Google Client ID loaded into env')
      }
      if (!globalWindow.gapi) {
        throw new Error('Google API client library not loaded into window')
      }

      globalWindow.gapi.load('auth2', () => {
        if (globalWindow.gapi.auth2.getAuthInstance()) {
          resolve()
        } else {
          globalWindow.gapi.auth2.init({ client_id: clientId }).then(() => {
            resolve()
          })
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

export default function NavUnauthenticated() {
  const auth = useAuth()

  // Populate as the variables and libraries are loaded
  const [enabledLoginMethods, setEnabledLoginMethods] = useState({
    MOCK: true,
    GOOGLE: false,
  })
  console.log(enabledLoginMethods)

  useEffect(() => {
    let mounted = true

    loadGoogleOauth()
      .then(() => {
        if (mounted) {
          setEnabledLoginMethods({ ...enabledLoginMethods, GOOGLE: true })
        }
      })
      .catch(error => console.error(error))

    return function cleanup() {
      mounted = false
    }
  }, [])

  const [signInState, setSignInState] = useReducer(
    (state: SignInState, newState: SignInNewState) => ({
      ...state,
      ...newState,
    }),
    { opened: false, loading: false, show: 'signin' }
  )
  const [Alert, setAlert] = useAlert(null)
  const openSignIn = () => setSignInState({ opened: true })
  const closeSignIn = () => setSignInState({ opened: false })

  // Focus on first form element when the modal opens
  const formFocusRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (signInState.opened && formFocusRef.current) {
      formFocusRef.current.focus()
    }
  }, [signInState])

  const googleLogin = async () => {
    console.log('Google login...')
    try {
      const globalWindow = window as any
      const auth2 = globalWindow.gapi.auth2.getAuthInstance()
      console.log('auth2', auth2)
      const googleUser = await auth2.signIn()
      console.log('Google user', googleUser)
      const googleToken = googleUser.getAuthResponse().id_token

      if (!googleToken) {
        throw new Error('Could not get Google token')
      }

      submitSignIn({ provider: 'GOOGLE', token: googleToken })
    } catch (error) {
      setAlert({
        message: 'There was an error signing in with Google',
        severity: 'error',
      })
      console.error(error)
    }
  }

  const mockLogin = () => submitSignIn({ provider: 'MOCK', token: 'foobar' })

  const submitPasswordSignIn = async event => {
    event.preventDefault()

    const params: AuthBody = {
      provider: 'PASSWORD',
      token: 'foobar',
      email: event.target.email.value,
      password: event.target.password.value,
    }

    submitSignIn(params)
  }

  const submitSignIn = (params: AuthBody) => {
    setSignInState({ loading: true })
    setAlert(null)

    auth
      .login(params)
      .then(() => {
        closeSignIn()
      })
      .catch((error: Error) => {
        console.error(error)
        setAlert({
          message: 'There was an error authenticating your credentials',
          severity: 'error',
        })
      })
      .finally(() => {
        setSignInState({ loading: false })
      })
  }

  const submitSignUp = async event => {
    event.preventDefault()

    setSignInState({ loading: true })
    setAlert(null)

    const signInForm = {
      username: event.target.email.value,
      password: event.target.password.value,
    }
    const signUpForm = {
      ...signInForm,
      attributes: {
        email: event.target.email.value,
        gender: event.target.gender.value,
        birthdate: event.target.birthdate.value,
        given_name: event.target.name.value,
        preferred_username: event.target.email.value,
        'custom:has_boat': event.target.has_boat.value,
      },
    }
    console.log({ signUpForm })
  }

  return (
    <>
      <Button onClick={openSignIn} variant="contained" color="secondary">
        Sign In
      </Button>
      <Dialog
        isOpen={signInState.opened}
        onDismiss={closeSignIn}
        className="surface"
        aria-label="sign in"
        style={{ maxWidth: 500 }}
      >
        <button className="close-button" onClick={closeSignIn}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        {signInState.show === 'signin' ? (
          <Form onSubmit={submitPasswordSignIn}>
            <h2>Hello, Daddy</h2>
            <Alert />
            <Button
              variant="outlined"
              loading={signInState.loading}
              disabled={!enabledLoginMethods.MOCK}
              onClick={mockLogin}
              style={{ justifyContent: 'center' }}
            >
              Mock Sign-In (Test User)
            </Button>
            <Button
              variant="outlined"
              loading={signInState.loading}
              disabled={!enabledLoginMethods.GOOGLE}
              onClick={googleLogin}
              style={{ justifyContent: 'center' }}
            >
              <GoogleIcon />
              <span>Sign in with Google</span>
            </Button>
            {/* <label htmlFor="sessionform__email">Email</label>
            <input
              type="email"
              name="email"
              id="sessionform__email"
              required
              autoFocus
              ref={formFocusRef}
            />
            <label htmlFor="sessionform__password">Password</label>
            <input
              type="password"
              name="password"
              id="sessionform__password"
              required
            />
            <SubmitRow>
              <Button
                type="submit"
                loading={signInState.loading}
                variant="contained"
                color="primary"
              >
                Sign In
              </Button>
              <Button
                onClick={() =>
                  setSignInState({
                    show: 'signup',
                  })
                }
              >
                Sign Up
              </Button>
            </SubmitRow> */}
          </Form>
        ) : (
          <Form onSubmit={submitSignUp}>
            <h2>Welcome, Daddy</h2>
            <Alert />
            <label htmlFor="sessionform__email">Email</label>
            <input
              type="email"
              name="email"
              id="sessionform__email"
              required
              autoFocus
              ref={formFocusRef}
            />
            <label htmlFor="sessionform__password">Password</label>
            <input
              type="password"
              name="password"
              id="sessionform__password"
              required
            />
            <label htmlFor="sessionform__name">Name</label>
            <input
              type="text"
              name="name"
              id="sessionform__name"
              required
              placeholder="Given name or nickname"
            />
            <label htmlFor="sessionform__birthdate">Birthday</label>
            <input
              type="date"
              name="birthdate"
              id="sessionform__birthdate"
              required
            />
            <div className={checkButtonContainerClass}>
              <CheckButton name="gender" value="male">
                👨 I'm a daddy
              </CheckButton>
              <CheckButton name="has_boat" value="true">
                🛥️ I have a boat
              </CheckButton>
            </div>
            <SubmitRow>
              <Button
                type="submit"
                loading={signInState.loading}
                variant="contained"
                color="primary"
              >
                Sign Up
              </Button>
              <Button
                onClick={() =>
                  setSignInState({
                    show: 'signin',
                  })
                }
              >
                Sign In
              </Button>
            </SubmitRow>
          </Form>
        )}
      </Dialog>
    </>
  )
}
