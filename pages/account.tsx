import { useUser } from 'context/user-context'
import Layout from 'components/Layout'
import AccountForm from 'components/AccountForm'

export default function ProfileEdit() {
  const { data } = useUser()

  return (
    <Layout title="Your Boat Daddy Account">
      <h1>Account Settings</h1>
      <AccountForm user={data} />
    </Layout>
  )
}

ProfileEdit.auth = true
