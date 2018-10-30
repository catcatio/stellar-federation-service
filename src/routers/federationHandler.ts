import { Router } from 'express'
import getAccountBy from './getAccountBy';
import { memoHash } from '../utils/cryptoHelper';

export const handler = (): Router => {
  const path = '/federation'

  const router = Router()

  router.get(path, async (req, res) => {
    const { q, type } = req.query
    const account = await getAccountBy(type, q)

    if (!account) {
      return res.status(404).send('Not Found')
    }

    return res.json({
      'stellar_address': `${account.name}*${account.domain}`,
      'account_id': account.account,
      'memo': memoHash(account.internalAccountHash),
      'memo_type': 'hash',
    })
  })

  return router
}
