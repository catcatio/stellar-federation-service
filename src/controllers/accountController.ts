import { Account } from "../models"
import { promises } from "fs";

const getById = (id) => {
  return Account.findById(id)
}

const getByAccount = (account: string) => {
  return Account.findOne({ where: { account } })
}

const getByName = (name: string, domain: string) => {
  return Account.findOne({ where: { name, domain } })
}

const create = (name: string, domain: string, account: string, accountType: string = '0', internalAccount?: string) => {
  return Account.create<Account>({
    name,
    domain,
    account,
    accountType,
    internalAccount
  })
}

const update = async (id: string, name: string, domain: string, account: string, accountType: string, internalAccount: string) => {
  // TODO: should not be able to update account
  const [result] = await Account.update<Account>({
    name,
    domain,
    account,
    accountType,
    internalAccount
  }, {
      where: { id }
    },
  )

  console.log(result)

  return result <= 0
    ? Promise.reject(new Error('Not Found'))
    : result
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
  getByName,
  create,
  update,
  delete: delete_
}