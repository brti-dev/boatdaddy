import { useReducer, SyntheticEvent, ChangeEvent } from 'react'
import { useMutation, gql } from '@apollo/client'

import { USERNAME_TESTS } from 'src/user'
import { User } from 'src/interfaces/user'
import useAlert from 'src/lib/use-alert'
import { Form, FormGroup, TextInput } from 'src/components/Form'
import CheckButton, {
  checkButtonContainerClass,
} from 'src/components/CheckButton'
import Button from 'src/components/Button'
import { CreateSignatureMutation } from 'src/interfaces/api/CreateSignatureMutation'
import { UserUpdateInput } from 'src/interfaces/api/User'

type FormStateIdentity = {
  data: {
    name: string
    email: string
    username: string
    birthday: string
    isDaddy: boolean
    bio: string
    hasBoat: boolean
    aboutBoat: string
    boatImage: string
  }
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

const CLOUDINARY_API_ENDPOINT = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
const RESTRICT_AGE_MIN =
  Number(process.env.NEXT_PUBLIC_RESTRICTED_AGE_MIN) || 18

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

function parseData(user: User) {
  return {
    name: user.profile.name || '',
    email: user.email,
    username: user.username,
    birthday: user.profile.birthday || '',
    isDaddy: user.profile.isDaddy || false,
    bio: user.profile.bio || '',
    hasBoat: user.profile.hasBoat || false,
    aboutBoat: user.profile.aboutBoat || '',
    boatImage: user.profile.boatImage || '',
  }
}

function parseInput(data: UserUpdateInput) {
  const { email, username, ...profile } = data
  return {
    email,
    username,
    profile,
  }
}

export default function AccountEdit({ user }: { user: User }) {
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

  const [state, setState] = useReducer(
    (state: FormState, newState: FormNewState) => ({
      ...state,
      ...newState,
    }),
    {
      data: parseData(user),
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

    setState({ data: { ...state.data, [name]: value } })
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
    const birthYear = Number(state.data.birthday.slice(0, 4))
    const date = new Date()
    const thisYear = date.getFullYear()
    const userAge = thisYear - birthYear

    if (userAge < RESTRICT_AGE_MIN) {
      setState({
        error: {
          inputName: 'birthday',
          message: `You must be at least ${RESTRICT_AGE_MIN} years old to register`,
        },
      })

      return
    }

    if (state.data.isDaddy && userAge < 20) {
      setState({
        error: {
          inputName: 'birthday',
          message: "Do you really think you're old enough to be a daddy?!",
        },
      })

      return
    }

    setState({ loading: true })

    const vars = { id: user.id, input: parseInput(state.data) }

    console.log('mutate', vars)
    ;(i =>
      new Promise(function (resolve) {
        return setTimeout(resolve, i)
      }))(1000).then(() => setState({ loading: false }))

    // TODO ... ...
    // const fetchMethod = 'POST'
    // fetch(API_ENDPOINT, {
    //   method: fetchMethod,
    //   body: JSON.stringify(state.data),
    // })
    //   .then(async res => {
    //     if (!res.ok) {
    //       const json = await res.json()
    //       throw new Error(json.message ?? 'Something went wrong')
    //     }

    //     return res.json()
    //   })
    //   .then(() => {
    //     setAlert({ message: 'Account updated', severity: 'success' })
    //     scrollToTop()
    //   })
    //   .catch(err => {
    //     setAlert({
    //       message: err.message ?? 'Something went wrong',
    //       severity: 'error',
    //     })
    //   })
    //   .finally(() => setState({ loading: false }))
  }

  const isError = (name: string) => state.error?.inputName === name

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <Alert />
      <FormGroup
        label="Name"
        input={
          <TextInput
            name="name"
            value={state.data.name}
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
            value={state.data.email}
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
            value={state.data.username}
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
            value={state.data.birthday?.toString().slice(0, 10)}
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
          checked={!!state.data.isDaddy}
          onChange={checked =>
            setState({
              data: {
                ...state.data,
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
          checked={!!state.data.hasBoat}
          onChange={checked =>
            setState({
              data: {
                ...state.data,
                hasBoat: checked,
              },
            })
          }
        >
          🛥️ I have a boat
        </CheckButton>
      </div>
      <FormGroup
        className={!state.data?.isDaddy && 'visually-hidden'}
        label="About you👨"
        input={
          <TextInput
            type="date"
            name="bio"
            value={state.data.bio}
            multiline
            rows={2}
            onChange={handleChange}
          />
        }
        error={isError('bio')}
        helperText={isError('bio') ? state.error.message : null}
      />
      <FormGroup
        className={!state.data?.hasBoat && 'visually-hidden'}
        label="About your boat🛥️"
        input={
          <TextInput
            type="date"
            name="aboutBoat"
            value={state.data.aboutBoat}
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
        value={state.data.boatImage}
        onChange={event => handleChange(event, event.target.value)}
      />
      <FormGroup
        className={!state.data?.hasBoat && 'visually-hidden'}
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
      {state.data?.hasBoat && state.data?.boatImage && (
        <div>
          <img src={state.data.boatImage} alt="Your boat" />
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
  )
}
