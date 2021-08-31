import { useSession } from 'next-auth/client'

import { Session } from 'src/session'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import AccountForm from 'src/components/AccountForm'

export default function ProfileEdit() {
  const [session_] = useSession()
  const session: Session = session_

  if (!session) {
    return (
      <ErrorPage>
        <p>No session found</p>
      </ErrorPage>
    )
  }

  return (
    <Layout title="Your Boat Daddy Account">
      <h1>{session.user.identity ? 'Edit' : 'Create'} Account</h1>
      <AccountForm account={session.user} />
    </Layout>
  )
}

ProfileEdit.auth = true
