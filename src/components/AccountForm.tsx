import { SyntheticEvent, ChangeEvent, useEffect, useRef, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

import { User } from 'src/interfaces/user'
import { CreateSignature_mutation } from 'src/interfaces/api/_image'
import { UserUpdateInput } from 'src/interfaces/api/_user'
import userDataFragment from 'src/graphql/fragments/user-data'
import { USERNAME_TESTS } from 'src/user'
import useAlert from 'src/lib/use-alert'
import { Form, FormGroup, TextInput, useForm } from './Form'
import CheckButton, { checkButtonContainerClass } from './CheckButton'
import Button from './Button'
import BoatImage from './BoatImage'
import ProfileImage from './ProfileImage'

type UploadImageResponse = {
  secure_url: string
  public_id: string
}

const CLOUDINARY_API_ENDPOINT = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
const RESTRICT_AGE_MIN =
  Number(process.env.NEXT_PUBLIC_RESTRICTED_AGE_MIN) || 18
const MAX_LENGTHS = {
  name: 25,
  username: 25,
  bio: 255,
  aboutBoat: 255,
  boatName: 25,
}

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
  timestamp: number,
  userId: number
): Promise<UploadImageResponse> {
  const formData = new FormData()
  formData.append('file', image)
  formData.append('signature', signature)
  formData.append('timestamp', timestamp.toString())
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? '')
  // formData.append('public_id', `boats/${userId}`)

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
    image: user.image || '',
    birthday: user.profile.birthday || '',
    isBoatDaddy: user.profile.isBoatDaddy || false,
    bio: user.profile.bio || '',
    aboutBoat: user.profile.aboutBoat || '',
    boatImage: user.profile.boatImage || '',
    boatName: user.profile.boatName || '',
  }
}

function parseInput(data: UserUpdateInput) {
  const { email, username, image, ...profile } = data
  return {
    email,
    username,
    image,
    profile,
  }
}

export default function AccountEdit({ user }: { user: User }) {
  const router = useRouter()

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
      const imageData = await uploadImage(
        imageFile,
        signature,
        timestamp,
        user.id
      )
      console.log('Image upload data', imageData)

      if (!imageData.public_id) {
        console.error(
          'Could not get public_id from imageData result',
          imageData
        )
        throw new Error(uploadErrorMessage)
      }

      return `cloudinaryPublicId=${imageData.public_id}`
    } catch (error) {
      console.error(error)
      const message = String(error)
      setState({ error: { message, inputName: 'boatImage' } })

      return ''
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

  // Track changes and user events that leave the page
  const [hasChanges, setHasChanges] = useState(false)
  const Router = useRouter()
  useEffect(() => {
    const notSaved = hasChanges
    console.log('notSaved', notSaved)
    const confirmationMessage = 'Changes you made may not be saved.'
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      ;(e || window.event).returnValue = confirmationMessage
      return confirmationMessage // Gecko + Webkit, Safari, Chrome etc.
    }
    const beforeRouteHandler = (url: string) => {
      if (Router.pathname !== url && !confirm(confirmationMessage)) {
        // to inform NProgress or something ...
        Router.events.emit('routeChangeError')
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`
      }
    }
    if (notSaved) {
      console.log('Not saved add eh')
      window.addEventListener('beforeunload', beforeUnloadHandler)
      Router.events.on('routeChangeStart', beforeRouteHandler)
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
      Router.events.off('routeChangeStart', beforeRouteHandler)
    }
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
      Router.events.off('routeChangeStart', beforeRouteHandler)
    }
  }, [hasChanges])

  const [Alert, setAlert] = useAlert(null)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    value: string | number | boolean | null
  ) => {
    setHasChanges(true)
    setAlert(null)

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

    if (MAX_LENGTHS[name] && String(value).length > MAX_LENGTHS[name]) {
      setState({
        error: {
          inputName: name,
          message: `Max langth is ${MAX_LENGTHS[name]} characters`,
        },
      })

      return
    }

    doHandleChange(event, value)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0]

      // Read file data and temporarily insert image placeholder
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result as string
        handleChange(event, imageData)
      }
      reader.readAsDataURL(file)

      handleImageUpload(file).then(imageSrc => {
        console.log('image upload src', imageSrc)
        handleChange(event, imageSrc)
      })
    }
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

    if (state.data.isBoatDaddy && userAge < 20) {
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

    setHasChanges(false)

    try {
      const res = await submitUpdate({ variables })
      console.log('Submit res', res)
      setAlert({ message: 'Account saved', severity: 'success' })
      router.push(`/@${user.username}`)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    setAlert({ message: String(error), severity: 'error' })
  }, [error])

  useEffect(() => {
    if (!state.error) {
      setAlert(null)
    }
  }, [state.error])

  const profileImgRef = useRef(null)
  const boatImgRef = useRef(null)

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <Alert />
      <input
        type="hidden"
        name="image"
        value={state.data.image}
        onChange={event => handleChange(event, event.target.value)}
      />
      <FormGroup
        label="Profile picture"
        input={
          <input
            type="file"
            name="image"
            accept="image/*"
            className="visually-hidden"
            onChange={handleFileChange}
            ref={profileImgRef}
          />
        }
      />
      <div style={{ marginTop: '-1em' }}>
        {state.data?.image ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
            <ProfileImage src={state.data.image} alt="Your profile picture" />
            <Button
              variant="outlined"
              onClick={() => profileImgRef.current.click()}
            >
              Upload new
            </Button>
          </div>
        ) : (
          <Button
            variant="outlined"
            onClick={() => profileImgRef.current.click()}
          >
            Add a picture
          </Button>
        )}
      </div>
      <FormGroup
        label="Name"
        input={
          <TextInput
            name="name"
            value={state.data.name}
            required
            placeholder="Given name or nickname"
            maxLength={MAX_LENGTHS.name}
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
            maxLength={MAX_LENGTHS.username}
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
      <div>{state.data.isBoatDaddy ? 'YES daddy' : 'NO daddy'}</div>
      <div className={checkButtonContainerClass}>
        <CheckButton
          name="isBoatDaddy"
          value="true"
          checked={state.data.isBoatDaddy ? true : false}
          onChange={checked =>
            setState({
              data: {
                ...state.data,
                isBoatDaddy: checked,
              },
            })
          }
        >
          🧑 I'm a Boat Daddy
        </CheckButton>
        <CheckButton
          name="isBoatDaddy"
          value="false"
          checked={state.data.isBoatDaddy ? false : true}
          onChange={checked =>
            setState({
              data: {
                ...state.data,
                isBoatDaddy: checked ? false : true,
              },
            })
          }
        >
          🕵 I'm looking for a Boat Daddy
        </CheckButton>
      </div>
      <FormGroup
        className={!state.data?.isBoatDaddy && 'visually-hidden'}
        label="About you👨"
        input={
          <TextInput
            type="date"
            name="bio"
            value={state.data.bio}
            multiline
            rows={2}
            maxLength={MAX_LENGTHS.bio}
            onChange={handleChange}
          />
        }
        error={isError('bio')}
        helperText={isError('bio') ? state.error.message : null}
      />
      <FormGroup
        className={!state.data?.isBoatDaddy && 'visually-hidden'}
        label="Boat Name"
        input={
          <TextInput
            name="boatName"
            value={state.data.boatName}
            onChange={handleChange}
          />
        }
        error={isError('boatName')}
        helperText={isError('boatName') ? state.error.message : null}
      />
      <FormGroup
        className={!state.data?.isBoatDaddy && 'visually-hidden'}
        label="About your boat🛥️"
        input={
          <TextInput
            type="date"
            name="aboutBoat"
            value={state.data.aboutBoat}
            multiline
            rows={2}
            maxLength={MAX_LENGTHS.aboutBoat}
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
        className={!state.data?.isBoatDaddy && 'visually-hidden'}
        label="Boat picture"
        input={
          <input
            type="file"
            name="boatImage"
            accept="image/*"
            className="visually-hidden"
            onChange={handleFileChange}
            ref={boatImgRef}
          />
        }
        error={isError('boatImage')}
      />
      <div
        style={{
          marginTop: '-1em',
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
        }}
      >
        {state.data?.isBoatDaddy && state.data?.boatImage && (
          <BoatImage src={state.data.boatImage} alt="Your boat" />
        )}
        {state.data?.isBoatDaddy && (
          <div>
            <Button
              variant="outlined"
              onClick={() => boatImgRef.current.click()}
            >
              Upload picture
            </Button>
          </div>
        )}
      </div>
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
