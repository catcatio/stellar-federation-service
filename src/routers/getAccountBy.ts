import accountController from '../controllers/accountController';

export default async (type: string, query: string) => {
  switch (type) {
    case 'name':
      const name = query.split('*', 2)
      if (name.length != 2) {
        return null
      }
      return await accountController.getByName(name[0], name[1])

    case 'id':
      return await accountController.getByAccount(query)
  }
}