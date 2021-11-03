import { useUser } from 'src/context/user-context'
import Layout from 'src/components/Layout'
import AccountForm from 'src/components/AccountForm'

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
