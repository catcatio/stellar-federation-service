
import { Router} from 'express'

import { handler as accountHandler} from './accountHandler'

export default async () => {
  const router = Router()
  router.use(accountHandler())
  return router
}

// TODO: API for ipfs