import { useReducer, SyntheticEvent } from 'react'
import { useSession } from 'next-auth/client'

import { Session, Identity } from '@/lib/session'
import useAlert from '@/lib/use-alert'
import scrollToTop from '@/lib/scroll-to-top'
import Layout from '@/components/Layout'
import { Form, FormGroup, TextInput } from '@/components/Form'
import CheckButton, {
  checkButtonContainerClass,
} from '@/components/CheckButton'
import Button from '@/components/Button'

type FormStateIdentity = {
  identity: Identity | null
}
type FormStateLoading = {
  loading: boolean
}
type FormStateError = {
  error: null | {
    inputName?: string
    message?: string
  }
}
type FormState = FormStateIdentity & FormStateLoading & FormStateError
type FormNewState = FormStateIdentity | FormStateLoading | FormStateError

const API_ENDPOINT = '/api/account'

export default function ProfileEdit() {
  const [session_] = useSession()
  const session: Session = session_

  const [state, setState] = useReducer(
    (state: FormState, newState: FormNewState) => ({
      ...state,
      ...newState,
    }),
    {
      identity: session.user?.identity ?? { name: session.user.name },
      loading: false,
      error: null,
    }
  )

  const [Alert, setAlert] = useAlert(null)

  const handleChange = (
    event: SyntheticEvent,
    value: string | number | boolean | null
  ) => {
    const { name } = event.target as HTMLInputElement

    if (state.error?.inputName === name) {
      setState({ error: null })
    }

    if (name === 'username') {
      const testInitialChar = /^[a-zA-Z]/.test(value as string)
      if (!testInitialChar) {
        const message = 'Username must begin with a letter A-Z'
        setState({ error: { inputName: name, message } })

        return
      }

      const testLength = (value as string).length >= 3
      if (!testLength) {
        const message = 'Username must be at least three characters long'
        setState({ error: { inputName: name, message } })

        return
      }
    }

    setState({ identity: { ...state.identity, [name]: value } })
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (state.error) {
      setAlert(new Error('Please fix the errors below before submitting'))

      return
    }

    // Check user age
    const birthYear = Number(state.identity.birthday.slice(0, 4))
    const date = new Date()
    const thisYear = date.getFullYear()
    const userAge = thisYear - birthYear

    if (userAge < 13) {
      setState({
        error: {
          inputName: 'birthday',
          message: 'You must be at least 13 years old to register',
        },
      })

      return
    }

    if (state.identity.isDaddy && userAge < 30) {
      setState({
        error: {
          inputName: 'birthday',
          message: "Do you really think you're old enough to be a daddy?!",
        },
      })

      return
    }

    setState({ loading: true })

    const fetchMethod = !session.user.identity ? 'PUT' : 'POST'
    console.log(fetchMethod, state.identity)
    fetch(API_ENDPOINT, {
      method: fetchMethod,
      body: JSON.stringify(state.identity),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setAlert('🏝️ Account updated 🚣')
        scrollToTop()
      })
      .catch(err => {
        setAlert(new Error('Something went wrong'))
        console.error(err)
      })
      .finally(() => setState({ loading: false }))
  }

  console.log(state)

  const isError = (name: string) => state.error?.inputName === name

  return (
    <Layout title="Your Boat Daddy Account">
      <h1>{session.user.identity ? 'Edit' : 'Create'} Account</h1>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <Alert />
        <FormGroup
          label="Name"
          input={
            <TextInput
              name="name"
              value={session.user.identity?.name ?? session.user.name}
              required
              placeholder="Given name or nickname"
              onChange={handleChange}
            />
          }
          error={isError('name')}
          helperText={isError('name') ? state.error.message : null}
        />
        <FormGroup
          label="Email"
          input={
            <TextInput
              name="email"
              value={session.user.email}
              disabled
              onChange={handleChange}
            />
          }
        />
        <FormGroup
          label="Username"
          input={
            <TextInput
              name="username"
              value={session.user.identity?.username}
              required
              placeholder="Choose a username that begins with a letter"
              onChange={handleChange}
            />
          }
          error={isError('username')}
          helperText={isError('username') ? state.error.message : null}
        />
        <FormGroup
          label="Birthdate"
          input={
            <TextInput
              type="date"
              name="birthday"
              value={session.user.identity?.birthday?.toString().slice(0, 10)}
              id="sessionform__birthday"
              required
              onChange={handleChange}
            />
          }
          error={isError('birthday')}
          helperText={isError('birthday') ? state.error.message : null}
        />
        <div className={checkButtonContainerClass}>
          <CheckButton
            name="isDaddy"
            value="true"
            checked={!!session.user.identity?.isDaddy}
            onChange={checked =>
              setState({
                identity: {
                  ...state.identity,
                  isDaddy: checked,
                },
              })
            }
          >
            👨 I'm a daddy
          </CheckButton>
          <CheckButton
            name="hasBoat"
            value="true"
            checked={!!session.user.identity?.hasBoat}
            onChange={checked =>
              setState({
                identity: {
                  ...state.identity,
                  hasBoat: checked,
                },
              })
            }
          >
            🛥️ I have a boat
          </CheckButton>
        </div>
        <Button
          type="submit"
          loading={state.loading}
          variant="contained"
          color="primary"
          style={{ textAlign: 'center', justifyContent: 'center' }}
        >
          Update Account
        </Button>
      </Form>
    </Layout>
  )
}

ProfileEdit.auth = true
