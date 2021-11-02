import { useUser } from 'src/context/user-context'

export default function AdminDashboard() {
  const { data } = useUser()
  // session is always non-null inside this page, all the way down the React tree.
  return 'Welcome to super secret dashboard, Daddy'
}
AdminDashboard.admin = true
