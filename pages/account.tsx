import { useUser } from 'context/user-context'
import AccountForm from 'components/AccountForm'
import Layout from 'components/Layout'

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
