import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export const GraphQlDateTime = new GraphQLScalarType({
  name: 'Datetime',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString() // Value sent to the client
  },
  parseValue(value) {
    // Value from the client
    const dateValue = new Date(value)
    return Number.isNaN(dateValue.getTime()) ? undefined : dateValue
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const value = new Date(ast.value)
      return Number.isNaN(value.getTime()) ? undefined : value
    }
    return undefined
  },
})
