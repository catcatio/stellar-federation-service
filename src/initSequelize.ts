import { Sequelize } from 'sequelize-typescript'
import { Account, Version } from './models';

export default async ({ sequelizeConfig }) => {
  console.log('initial Sequelize')
  const defaultConfig = {
    modelPaths: [Account, Version],
    operatorsAliases: Sequelize.Op as any,
    logging: false,
  }

  const option: any = Object.assign({}, defaultConfig, sequelizeConfig)

  const sequelize = new Sequelize(option)
  console.log('Sequelize initialized: ', await sequelize.databaseVersion())
  return sequelize
}
