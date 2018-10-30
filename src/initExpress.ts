import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'

export default async ({port}) => {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cors())

  app.listen(port, (err) => {
    if (err) {
      throw err
    }

    console.log(`Listening to ${port}`)
  })

  return app
}
