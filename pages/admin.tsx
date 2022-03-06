import Layout from 'components/Layout'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <Layout>
      <p>Welcome to super secret dashboard, Daddy</p>
      <ul>
        <li>
          <Link href="/daddies/add">Add a new Boat Daddy</Link>
        </li>
      </ul>
    </Layout>
  )
}
AdminDashboard.admin = true
