import { useEffect, useReducer, useRef } from 'react'
import { useRouter } from 'next/router'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'
import { Dialog } from '@reach/dialog'
import { VisuallyHidden } from '@reach/visually-hidden'

import useAlert from 'src/lib/use-alert'
import { Form, SubmitRow } from './Form'
import Button from './Button'
import Avatar from './Avatar'
import CheckButton, { checkButtonContainerClass } from './CheckButton'
import formClasses from 'styles/components/form.module.scss'

export default function NavUnauthenticated() {
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

  const submitSignIn = async event => {
    event.preventDefault()

    setSignInState({ loading: true })
    setAlert(null)

    const form = {
      email: event.target.email.value,
    }
    console.log(form)

    // const form = {
    //   username: event.target.email.value,
    //   password: event.target.password.value,
    // }
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
          <Form method="post">
            <h2>Hello, Daddy</h2>
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
            </SubmitRow>
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
