import { Account } from "../models"

const getById = (id) => {
  return Account.findById(id)
}

const getByAccount = (account: string) => {
  return Account.findOne({ where: { account } })
}

const getByName = (name: string, domain: string) => {
  return Account.findOne({ where: { name, domain } })
}

const create = (name: string, domain: string, account: string) => {
  return Account.create<Account>({
    name,
    domain,
    account
  })
}

const update = (id: string, name: string, domain: string, account: string) => {
  return Account.update<Account>({
    name,
    domain,
    account
  }, {
      where: { id }
    },
  )
}

const delete_ = (id: string) => {
  return Account.destroy({
    where: { id }
  })
}

export default {
  getById,
  getByAccount,
  getByName,
  create,
  update,
  delete: delete_
}