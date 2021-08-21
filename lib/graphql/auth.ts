import { Context } from './context'

/**
 * Determine if user has access to Query/Mutation. Yes if session exists
 */
export function authChecker({ context }: { context: Context }): Boolean {
  const { uid } = context

  return !!uid
}
