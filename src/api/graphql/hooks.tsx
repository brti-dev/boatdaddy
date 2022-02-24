import { useState, useEffect } from 'react'

import graphQlFetch from './fetch'

type HookState = {
  loading: boolean
  data: null | object
  error: null | string
}

/**
 * Parse the first GraphQL error
 *
 * @param {object} errors GraphQL `errors` response
 *
 * @returns {string} A stringified summary of the first error encountered
 */
function parseErrors(errors) {
  if (errors && errors[0]) {
    const error = errors[0]
    // if (error.extensions.code === 'BAD_USER_INPUT') {
    //   const details = error.extensions.exception.errors.join('\n ')
    //   return `${error.message}: ${details}`
    // }

    return `${error.extensions.code}: ${error.message}`
  }

  return null
}

/**
 * Query GraphQL and manage a simple state
 */
export function useQuery(
  query: string,
  variables: object = null,
  handleError = null
) {
  const [state, setState] = useState<HookState>({
    loading: true,
    data: null,
    error: null,
  })

  useEffect(() => {
    graphQlFetch(query, variables)
      .then(({ data, errors }) => {
        setState({
          loading: false,
          data,
          error: parseErrors(errors),
        })
      })
      .catch(error => {
        if (handleError) {
          handleError(error)
        }

        setState({
          ...state,
          loading: false,
          error,
        })
      })
  }, [])

  return state
}

/**
 * Mutate GraphQL and manage a simple state
 *
 * @param {string} query GraphQL mutation query
 * @param {function=} onSuccess Optional callback function, takes two arguments: data, error
 */
export function useMutation(
  query: string,
  onSuccess: (state?: object, error?: string) => void = null
): [
  (variables: any) => void,
  { loading: boolean; error: string | null; data: any }
] {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  })

  const mutate = async variables => {
    setState({ ...state, loading: true })

    try {
      const result = await graphQlFetch(query, variables)
      console.log('mutation result', result)

      setState({
        loading: false,
        data: result.data,
        error: parseErrors(result.errors),
      })

      if (onSuccess) {
        return onSuccess(state.data, state.error)
      }

      return result
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error,
      })

      throw error
    }
  }

  return [mutate, state]
}
