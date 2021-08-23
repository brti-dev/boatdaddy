import { useSession } from 'next-auth/client'
import { Session } from 'src/session'

export default function AdminDashboard() {
  const [session_] = useSession()
  const session: Session = session_
  // session is always non-null inside this page, all the way down the React tree.
  return 'Welcome to super secret dashboard, Daddy'
}
AdminDashboard.admin = true
