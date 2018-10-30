const defaultPort = '3000'

const port = parseInt(process.env.PORT || defaultPort, 10)
const sequelizeConfig = {
  name: process.env.FEDERATION_DB || 'federationdb',
  host: process.env.FEDERATION_HOST || 'federationpg',
  username: process.env.FEDERATION_USER || 'root',
  password: process.env.FEDERATION_PASSWORD || 'password',
  dialect: process.env.FEDERATION_DIALECT || 'postgres',
}

export default {
  port,
  sequelizeConfig
}