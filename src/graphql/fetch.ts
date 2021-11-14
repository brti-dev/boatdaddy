import { DocumentNode } from 'graphql'

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d')

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) {
    return new Date(value)
  }

  return value
}

/**
 * Parse the first GraphQL error
 *
 * @returns {string} A stringified summary of the first error encountered
 */
function parseErrors(errors): string {
  if (errors && errors[0]) {
    const error = errors[0]
    if (error.extensions.code === 'BAD_USER_INPUT') {
      const details = error.extensions.exception.errors.join('\n ')
      return `${error.message}: ${details}`
    }

    return `${error.extensions.code}: ${error.message}`
  }

  return null
}

/**
 * Common utility function to handle API calls
 */
async function graphQlFetch(
  query: string | DocumentNode,
  variables = {},
  cookie: string = null
) {
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!apiEndpoint) {
    throw new Error('API endpoint not set in env')
  }

  const headers: any = { 'Content-Type': 'application/json' }

  const jwt = localStorage.getItem('jwt')
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`
  }

  if (cookie) {
    headers.Cookie = cookie
  }

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ query, variables }),
  })
  const body = await response.text()
  const result = JSON.parse(body, jsonDateReviver)

  if (!result) {
    throw new Error('GraphQL fetch returned an empty result')
  }

  if (result.error) {
    throw new Error(parseErrors(result.error))
  }

  return result
}

export default graphQlFetch
