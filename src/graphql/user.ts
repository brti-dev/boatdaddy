import { Context } from 'src/interfaces/api/context'
import {
  User,
  UserAddInput,
  UserUpdateInput,
  UserUpdateInput_input,
  UserDeleteInput_input,
  UserVariables,
} from 'src/interfaces/api/User'
import { DeleteResult } from 'src/interfaces/api/globalTypes'
import userResolver from 'src/api/user'

const get = async (
  _,
  vars: UserVariables,
  ctx: Context
): Promise<User | null> => {
  const getResult = await userResolver.get(vars)

  return getResult
}

const add = async (_, vars: UserAddInput, ctx: Context): Promise<User> => {
  const addResult = await userResolver.add(vars)

  return addResult
}

const update = async (
  _,
  vars: UserUpdateInput_input,
  ctx: Context
): Promise<User> => {
  const { id, input } = vars
  const updateResult = await userResolver.update(id, input)

  return updateResult
}

const remove = async (
  _,
  vars: UserDeleteInput_input,
  ctx: Context
): Promise<DeleteResult> => {
  const { id } = vars
  const deleteResult = userResolver.delete(id)

  return deleteResult
}

export default { get, add, update, delete: remove }
