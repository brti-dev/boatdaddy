import {
  Button,
  Form,
  FormGroup,
  SubmitRow,
  TextInput,
  useAlert,
  useForm,
} from 'matterial'
import * as React from 'react'

import userDataFragment from 'api/graphql/fragments/user-data'
import { useMutation } from 'api/graphql/hooks'
import Layout from 'components/Layout'
import AccountForm from 'components/AccountForm'

const NEW_USER_MUTATION = `
  mutation userAdd($input: UserAddInput!) {
    userAdd(input: $input) {
      ...userData
    }
  }
  ${userDataFragment}
`

export default function AddDaddy() {
  const { form, setForm, handleChange, isError } = useForm({
    username: '',
    name: '',
    email: '',
  })

  const [Alert, setAlert] = useAlert(null)

  const [submitNewUser, { data, error, loading }] =
    useMutation(NEW_USER_MUTATION)

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    setAlert(null)

    submitNewUser({ input: form.data })
  }

  React.useEffect(() => {
    if (!!form.error) {
      console.error(form.error.message)
      setAlert({ severity: 'error', message: form.error.message })
    }

    if (error) {
      console.error(error)
      setAlert({ severity: 'error', message: error.toString() })
    }
  }, [form, error])

  return (
    <Layout title="New Daddy">
      <h1>New Daddy</h1>
      <p>Manually add a Boat Daddy</p>

      <Alert />

      {data?.userAdd ? (
        <AccountForm user={data.userAdd} />
      ) : (
        <Form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
          <FormGroup
            label="Name"
            input={
              <TextInput
                name="name"
                value={form.data.name}
                onChange={handleChange}
                required
              />
            }
            helperText={isError('name') && form.error.message}
          />
          <FormGroup
            label="Username"
            input={
              <TextInput
                name="username"
                value={form.data.username}
                onChange={handleChange}
                required
              />
            }
            helperText={isError('username') && form.error.message}
          />
          <FormGroup
            label="Email"
            input={
              <TextInput
                name="email"
                value={form.data.email}
                onChange={handleChange}
                required
              />
            }
            helperText={isError('email') && form.error.message}
          />
          <SubmitRow>
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={loading || !!form.error}
              variant="contained"
              color="primary"
            >
              Add Daddy
            </Button>
          </SubmitRow>
        </Form>
      )}
    </Layout>
  )
}

AddDaddy.admin = true
