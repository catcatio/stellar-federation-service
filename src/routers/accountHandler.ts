import { Router } from 'express'
import accountController from '../controllers/accountController';
import { Account } from 'src/models';

const accountToJson = (account: Account) => ({
  id: account.id,
  name: account.name,
  domain: account.domain,
  account: account.account,
  accountType: account.accountType,
  internalAccount: account.internalAccount,
  internalAccountHash: account.internalAccountHash
})

export const handler = () => {
  const router = Router()

  router.route('/account')
    .post(async (req, res) => {
      // TODO: for now, new account has not internal account_id
      return accountController.create(req.body)
        .then(account => res.json(accountToJson(account)))
        .catch(err => res.status(400).send(err.message))

    })

  router.route('/account/:id')
    .get(async (req, res) => {
      const account = await accountController.getById(req.params.id)
        .catch(err => {
          console.log(err.message)
          return null
        })

      if (!account) {
        return res.status(404).send('Not Found')
      }

      return res.json(accountToJson(account))
    })
    .put(async (req, res) => {
      // TODO: support partial update
      return accountController.update(req.params.id, req.body)
        .then(() => res.sendStatus(200))
        .catch(error => res.status(error.message === 'Not Found' ? 404 : 400).send(error.message))
    })
    .patch(async (req, res) => {
      return res.status(501).send('Not Implemented')
    })
    .delete(async (req, res) => {
      return accountController.delete(req.params.id)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(err.message === 'Not Found' ? 404 : 400).send(err.message))
    })

  return router
}


