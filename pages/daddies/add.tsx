import Layout from 'src/components/Layout'
import AccountForm from 'src/components/AccountForm'

export default function AddDaddy() {
  return (
    <Layout title="New Daddy">
      <h1>New Daddy</h1>
      <p>Manually add a user</p>
      <AccountForm />
    </Layout>
  )
}

AddDaddy.admin = true
