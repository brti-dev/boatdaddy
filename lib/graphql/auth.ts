import { AuthChecker } from 'type-graphql'
import { Context } from './context'

/**
 * Determine if user has access to Query/Mutation. Yes if session exists
 */
export const authChecker: AuthChecker<Context> = ({ context }) => {
  const { uid } = context

  return !!uid
}
