import { SyntheticEvent, ChangeEvent, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'

import { User } from 'src/interfaces/user'
import userDataFragment from 'src/graphql/fragments/user-data'
import { USERNAME_TESTS } from 'src/user'
import useAlert from 'src/lib/use-alert'
import { Form, FormGroup, TextInput, useForm } from 'src/components/Form'
import CheckButton, {
  checkButtonContainerClass,
} from 'src/components/CheckButton'
import Button from 'src/components/Button'
import { CreateSignature_mutation } from 'src/interfaces/api/Image'
import { UserUpdateInput } from 'src/interfaces/api/User'

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

const ACCOUNT_MUTATION = gql`
  mutation userUpdate($id: Int!, $input: UserUpdateInput!) {
    userUpdate(id: $id, input: $input) {
      ...userData
    }
  }
  ${userDataFragment}
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
    useMutation<CreateSignature_mutation>(SIGNATURE_MUTATION)

  const handleImageUpload = async (imageFile: File) => {
    const uploadErrorMessage = 'Could not upload image to the cloud'

    setState({ loading: true })

    try {
      const { data: signatureData } = await createSignature()
      if (!signatureData) {
        console.error(
          'Could not get signature data from API. See network result.'
        )
        throw new Error(uploadErrorMessage)
      }

      const { signature, timestamp } = signatureData.createImageSignature
      const imageData = await uploadImage(imageFile, signature, timestamp)

      if (!imageData.secure_url) {
        console.error(
          'Could not get secure_url from imageData result',
          imageData
        )
        throw new Error(uploadErrorMessage)
      }

      return imageData.secure_url
    } catch (error) {
      console.error(error)
      const message = String(error)
      setAlert({ message, severity: 'error' })
    } finally {
      setState({ loading: false })
    }
  }

  const [submitUpdate, { data, error, loading }] = useMutation(ACCOUNT_MUTATION)

  const {
    form: state,
    setForm: setState,
    handleChange: doHandleChange,
    isError,
  } = useForm(parseData(user))

  console.log(state)

  const [Alert, setAlert] = useAlert(null)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    value: string | number | boolean | null
  ) => {
    const { name } = event.target as HTMLInputElement
    console.log('change', name, value)

    if (name === 'username') {
      USERNAME_TESTS.map(({ test, message }) => {
        if (!test(value as string)) {
          setState({ error: { inputName: name, message } })

          return
        }
      })
    }

    doHandleChange(event, value)
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (!!state.error) {
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
          message: `You must be at least ${RESTRICT_AGE_MIN} years old to use this app`,
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

    const variables = { id: user.id, input: parseInput(state.data) }

    console.log('mutate', variables)

    submitUpdate({ variables })
  }

  useEffect(() => {
    setAlert(error)
  }, [error])

  useEffect(() => {
    if (!state.error) {
      setAlert(null)
    }
  }, [state.error])

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
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
        label={
          state.data?.boatImage
            ? 'Click to upload a new boat image'
            : 'Click to upload an image of your boat'
        }
        input={
          <input
            type="file"
            name="boatImage"
            accept="image/*"
            className="visually-hidden"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (event?.target?.files?.[0]) {
                const file = event.target.files[0]

                // Read file data and temporarily insert image placeholder
                const reader = new FileReader()
                reader.onloadend = () => {
                  const imageData = reader.result as string
                  handleChange(event, imageData)
                }
                reader.readAsDataURL(file)

                handleImageUpload(file).then(imageUrl => {
                  handleChange(event, imageUrl)
                })
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
        disabled={loading}
        loading={loading}
        variant="contained"
        color="primary"
        style={{ textAlign: 'center', justifyContent: 'center' }}
      >
        Update Account
      </Button>
    </Form>
  )
}
