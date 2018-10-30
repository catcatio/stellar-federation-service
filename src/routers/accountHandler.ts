import { Router } from 'express'
import accountController from '../controllers/accountController';
import { Account } from 'src/models';

const accountToJson = (account: Account) => ({
  id: account.id,
  name: account.name,
  domain: account.domain,
  account: account.account,
  accountType: account.accountType,
  internalAccount: account.internalAccount
})

export const handler = () => {
  const router = Router()

  router.route('/account')
    .post(async (req, res) => {
      const body = req.body

      // TODO: for now, new account has not internal account_id
      return accountController.create(body.name, body.domain, body.account)
        .then(account => res.json(accountToJson(account)))
        .catch(err => res.status(400).send(err.message))

    })

  router.route('/account/:id')
    .get(async (req, res) => {
      const account = await accountController.getById(req.params.id)

      if (!account) {
        return res.status(404).send('Not Found')
      }

      return res.json(accountToJson(account))
    })
    .put(async (req, res) => {
      // TODO: support partial update
      return accountController.update(req.params.id, req.body.name, req.body.domain, req.body.account, req.body.accountType, req.body.internalAccount)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(err.message === 'Not Found' ? 404 : 400).send(err.message))
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


