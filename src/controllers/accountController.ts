import { Account } from "../models"

const getById = (id) => {
  return Account.findById(id)
}

const getByAccount = (account: string) => {
  return Account.findOne({ where: { account } })
}

const getByHash = (internalAccountHash: string) => {
  return Account.findOne({ where: { internalAccountHash } })
}

const getByName = (name: string, domain: string) => {
  return Account.findOne({ where: { name, domain } })
}

const create = async (values) => {
  try {
    if (values.internalAccountHash == null) {
      values.internalAccountHash = ''
    }
    return Account.create<Account>(values)
  } catch (error) {
    return Promise.reject(error)
  }
}

const update = async (id: string, values) => {
  try {
    const [result] = await Account.update<Account>(values, { where: { id } })
    return result <= 0
      ? Promise.reject(new Error('Not Found'))
      : result
  } catch (error) {
    return Promise.reject(error)
  }
}

const delete_ = async (id: string) => {
  const result = await Account.destroy({
    where: { id }
  })

  return result <= 0
    ? Promise.reject(new Error('Not Found'))
    : result
}

export default {
  getById,
  getByAccount,
  getByHash,
  getByName,
  create,
  update,
  delete: delete_
}