import { useReducer, SyntheticEvent } from 'react'
import { useSession } from 'next-auth/client'

import { Session, Identity } from '@/lib/session'
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

type FormState = FormStateIdentity & FormStateLoading

type FormNewState = FormStateIdentity | FormStateLoading

export default function ProfileEdit() {
  const [session_] = useSession()
  const session: Session = session_

  const [state, setState] = useReducer(
    (state: FormState, newState: FormNewState) => ({
      ...state,
      ...newState,
    }),
    { identity: session.user.identity, loading: false }
  )

  const handleChange = (
    e: SyntheticEvent,
    value: string | number | boolean | null
  ) => {
    const { name } = e.target as HTMLInputElement
    setState({ identity: { ...state.identity, [name]: value } })
  }

  const handleSubmit = async () => {
    setState({ loading: true })
    if (!session.user.identity) {
      console.log('PUT', state.identity)
      // PUT call to API
    } else {
      console.log('POST', state.identity)
      // POST call to API
    }
  }

  console.log(state)

  return (
    <Layout title="Your Boat Daddy Account">
      <h1>Edit Account</h1>
      <Form onSubmit={handleSubmit}>
        <pre>{JSON.stringify(session, null, 2)}</pre>
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
        />
        <FormGroup
          label="Birthdate"
          input={
            <TextInput
              type="date"
              name="birthday"
              id="sessionform__birthday"
              required
              onChange={handleChange}
            />
          }
        />
        <div className={checkButtonContainerClass}>
          <CheckButton
            name="isDaddy"
            value="true"
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
        <div
          style={{ display: 'flex', flexDirection: 'row-reverse', gap: '1em' }}
        >
          <Button
            type="submit"
            loading={state.loading}
            variant="contained"
            color="primary"
          >
            Update Account
          </Button>
        </div>
      </Form>
    </Layout>
  )
}
