import {
  buildSchemaSync,
  Resolver,
  Query,
  ObjectType,
  Field,
  Int,
} from 'type-graphql'
// import { SessionResolver } from './auth'
import { ImageResolver } from './image'
import { ProfileResolver } from './profile'
import { authChecker } from './auth'

const ABOUT = 'Boat Daddy API 1.0'

@Resolver()
class AboutResolver {
  @Query(_returns => String)
  about() {
    return ABOUT
  }
}

// Query Error: .../Sites/boatdaddy/pages/hail.tsx: Cannot query field "foo" on type "Query". Validation of GraphQL query document failed
@Resolver()
class FooResolver {
  @Query(_returns => String)
  foo() {
    return ABOUT
  }
}

export const schema = buildSchemaSync({
  resolvers: [AboutResolver, ImageResolver, ProfileResolver, FooResolver],
  emitSchemaFile: process.env.NODE_ENV === 'development',
  authChecker,
})
