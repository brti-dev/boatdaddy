import { Context } from 'src/interfaces/api/context'
import { User, UserAddInput, UserVariables } from 'src/interfaces/api/User'
import { DeleteResult } from 'src/interfaces/api/globalTypes'
import userResolver from 'src/api/user'

const get = async (
  _,
  vars: UserVariables,
  ctx: Context
): Promise<User | null> => {
  const getRes = await userResolver.get(vars)

  return getRes
}

const add = async (_, vars: UserAddInput, ctx: Context): Promise<User> => {
  const addRes = userResolver.add(vars)

  return addRes
}

export default { get, add }
