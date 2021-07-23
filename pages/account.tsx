import { useSession } from 'next-auth/client'
import { Session } from '@/lib/session'

export default function ProfileEdit() {
  const [session_] = useSession()
  const session: Session = session_

  const handleSubmit = event => {}
  return <form onSubmit={handleSubmit}>{JSON.stringify(session)}</form>
}
