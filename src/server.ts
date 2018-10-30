import initExpress from './initExpress'
import initSequelize from './initSequelize'
import AccountRouter from './routers/account'
import FederationRouter from './routers/federation'
import { schemaVersion } from './models'
import versionController from './controllers/version';

const initDB = async (sequelize) => {
      // TODO: Explicit commmand for updating schema
      const currentSchemaVersion = schemaVersion
      const liveSchemaVersion = await versionController.getSchemaVersion()
        .catch(err => {
          console.log(err.message)
          return { value: '' }
        })
        .then(version => version ? version.value : '')
      console.log(`schema live: ${liveSchemaVersion}, current: ${currentSchemaVersion}`)
      if (!liveSchemaVersion || currentSchemaVersion !== liveSchemaVersion) {
        console.log(`updating schema to ${currentSchemaVersion}`)
        await sequelize.sync({force: true})
        const updateResult = await versionController.saveSchemaVersion(currentSchemaVersion)
        console.log(`schema updated to ${updateResult ? updateResult.value : '???'}`)
      }
}

const notFoundHandler = (req, res, next) => {
  const err = new Error('Not Found')
  const tmp = err as any
  tmp.status = 404
  next(err)
}

const exceptionHandler = (err, req, res, next) => {
  const status = err.status || 500
  res.status(status)
  res.send(`${status} ${err.message}`)
}


export const Server = (config) => {
  const start = async () => {
    console.log('starting server')
    const sequelize = await initSequelize(config)
    await initDB(sequelize)

    const accountRouter = await AccountRouter()
    const federationRouter = await FederationRouter()
    const app = await initExpress(config)
    const appFed = await initExpress({port: config.federationPort})
    app.use(accountRouter)
    appFed.use(federationRouter)

    app.use(notFoundHandler)
    app.use(exceptionHandler)
    appFed.use(notFoundHandler)
    appFed.use(exceptionHandler)
  }

  const stop = async () => {
    //
  }

  return {start, stop}
}
