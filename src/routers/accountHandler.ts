import { Router } from 'express'
import getAccountBy from './getAccountBy';
import accountController from '../controllers/accountController';

export const handler = () => {
  const router = Router()

  router.route('/account')
    .post(async (req, res) => {
      const body = req.body
      const account = await accountController.create(body.name, body.domain, body.account)

      res.json({
        id: account.id,
        name: account.name,
        domain: account.domain,
        account: account.account
      })
    })
    .get(async (req, res) => {
      const { q, type } = req.query
      const account = await getAccountBy(type, q)

      if (!account) {
        return res.status(404).send('Not Found')
      }

      return res.json({
        id: account.id,
        name: account.name,
        domain: account.domain,
        account: account.account
      })
    })

  router.route('/account/:id')
    .get((req, res) => {

    })
    .put((req, res) => {

    })
    .patch((req, res) => {

    })
    .delete((req, res) => {

    })

  return router
}


