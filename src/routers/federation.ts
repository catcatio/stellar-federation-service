
import { Router} from 'express'

import { handler as federationHandler} from './federationHandler'

export default async () => {
  const router = Router()
  router.use(federationHandler())
  return router
}

// TODO: API for ipfs