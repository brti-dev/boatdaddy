import { useReducer, SyntheticEvent, ChangeEvent } from 'react'
import { useSession } from 'next-auth/client'
import { useMutation, gql } from '@apollo/client'

import { Session, Identity, USERNAME_TESTS } from 'src/session'
import useAlert from 'src/lib/use-alert'
import scrollToTop from 'src/lib/scroll-to-top'
import Layout from 'src/components/Layout'
import { Form, FormGroup, TextInput } from 'src/components/Form'
import CheckButton, {
  checkButtonContainerClass,
} from 'src/components/CheckButton'
import Button from 'src/components/Button'
import ErrorPage from 'src/components/ErrorPage'
import { CreateSignatureMutation } from 'src/generated/CreateSignatureMutation'

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
type UploadImageResponse = {
  secure_url: string
}

const API_ENDPOINT = '/api/account'
const CLOUDINARY_API_ENDPOINT = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`

async function uploadImage(
  image: File,
  signature: string,
  timestamp: number
): Promise<UploadImageResponse> {
  const formData = new FormData()
  formData.append('file', image)
  formData.append('signature', signature)
  formData.append('timestamp', timestamp.toString())
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? '')

  const response = await fetch(CLOUDINARY_API_ENDPOINT, {
    method: 'POST',
    body: formData,
  })

  return response.json()
}

export default function ProfileEdit() {
  const [session_] = useSession()
  const session: Session = session_

  const [createSignature] =
    useMutation<CreateSignatureMutation>(SIGNATURE_MUTATION)

  const handleCreate = async data => {
    const { data: signatureData } = await createSignature()
    if (signatureData) {
      console.log(signatureData)
      const { signature, timestamp } = signatureData.createImageSignature
      const imageData = await uploadImage(data.image[0], signature, timestamp)
      console.log(imageData)
    }
  }

  if (!session) {
    return (
      <ErrorPage>
        <p>No session found</p>
      </ErrorPage>
    )
  }

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
    event: ChangeEvent<HTMLInputElement>,
    value: string | number | boolean | null
  ) => {
    const { name } = event.target as HTMLInputElement

    if (state.error?.inputName === name) {
      setState({ error: null })
    }

    if (name === 'username') {
      USERNAME_TESTS.map(({ test, message }) => {
        if (!test(value as string)) {
          setState({ error: { inputName: name, message } })

          return
        }
      })
    }

    setState({ identity: { ...state.identity, [name]: value } })
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (state.error) {
      setAlert({
        message: 'Please fix the errors below before submitting',
        severity: 'error',
      })

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
    fetch(API_ENDPOINT, {
      method: fetchMethod,
      body: JSON.stringify(state.identity),
    })
      .then(async res => {
        if (!res.ok) {
          const json = await res.json()
          throw new Error(json.message ?? 'Something went wrong')
        }

        return res.json()
      })
      .then(data => {
        setAlert({ message: 'Account updated', severity: 'success' })
        scrollToTop()
      })
      .catch(err => {
        setAlert({
          message: err.message ?? 'Something went wrong',
          severity: 'error',
        })
      })
      .finally(() => setState({ loading: false }))
  }

  const isError = (name: string) => state.error?.inputName === name

  return (
    <Layout title="Your Boat Daddy Account">
      <h1>{session.user.identity ? 'Edit' : 'Create'} Account</h1>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
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
          label="Birthday"
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
        <FormGroup
          className={!state.identity?.isDaddy && 'visually-hidden'}
          label="About you👨"
          input={
            <TextInput
              type="date"
              name="bio"
              value={session.user.identity?.bio}
              multiline
              rows={2}
              onChange={handleChange}
            />
          }
          error={isError('bio')}
          helperText={isError('bio') ? state.error.message : null}
        />
        <FormGroup
          className={!state.identity?.hasBoat && 'visually-hidden'}
          label="About your boat🛥️"
          input={
            <TextInput
              type="date"
              name="aboutBoat"
              value={session.user.identity?.aboutBoat}
              multiline
              rows={2}
              onChange={handleChange}
            />
          }
          error={isError('aboutBoat')}
          helperText={isError('aboutBoat') ? state.error.message : null}
        />
        <input
          type="hidden"
          name="boatImage"
          value={session.user.identity?.boatImage}
          onChange={event => handleChange(event, event.target.value)}
        />
        <FormGroup
          className={!state.identity?.hasBoat && 'visually-hidden'}
          label="Add an image of your boat"
          input={
            <input
              type="file"
              name="boatImage"
              accept="image/*"
              className="visually-hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0]
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    handleChange(event, reader.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
          }
          error={isError('boatImage')}
        />
        {state.identity?.hasBoat && state.identity?.boatImage && (
          <div>
            <img src={state.identity.boatImage} alt="Your boat" />
          </div>
        )}
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
