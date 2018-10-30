import 'chai'
import { expect } from 'chai';

import * as request from 'request-promise-native'
import { Keypair } from 'stellar-base/lib/keypair'

const rand = () => `${Math.round(Math.random() * 10000)}`

const domain = 'e2etest.ab'

describe('E2E', async () => {

  let testAccount
  before(async () => {
    const body = {
      name: `cool_${rand()}`,
      domain,
      account: Keypair.random().publicKey(),
      accountType: '0',
      internalAccount: Keypair.random().publicKey(),
    }

    testAccount = await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    })

    console.log(`account ${testAccount.id} created`)
  })

  after(async () => {
    await request({
      uri: `http://localhost:9090/account/${testAccount.id}`,
      method: 'DELETE',
      json: true
    }).catch(error=> error)
    .then(() => console.log(`account ${testAccount.id} deleted`))

  })

  it('should return 404 if GET non existing user', async () => {
    const ret = await request({
      uri: 'http://localhost:9090/account/af67f4c8-dc0a-11e8-9f8b-f2801f1b9fd1',
      method: 'GET',
      json: true
    }).catch(err => err)

    expect(ret).is.instanceof(Error)
    expect(ret.statusCode).is.eq(404)
  })

  it('should be able to add a new user', async () => {
    expect(testAccount).to.exist
  })

  it('should be able to get a user by id', async () => {
    const retAccount = await request({
      uri: `http://localhost:9090/account/${testAccount.id}`,
      method: 'GET',
      json: true
    })

    expect(retAccount).to.exist
    expect(retAccount.name).to.eq(testAccount.name)
    expect(retAccount.domain).to.eq(testAccount.domain)
    expect(retAccount.account).to.eq(testAccount.account)
    expect(retAccount.accountType).to.eq('0')
    expect(retAccount.internalAccount).to.eq(testAccount.internalAccount)
    expect(retAccount.internalAccountHash).to.not.null
  })

  it('should return 400 when adding invalid account', async () => {
    const body = {
      name: `cool_${rand()}`,
      domain,
      account: 'asdfasdf'
    }

    const ret = await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    }).catch(err => err)

    expect(ret).is.instanceof(Error)
    expect(ret.statusCode).is.eq(400)
  })

  it('should return 400 when adding existing account', async () => {
    const body = {
      name: testAccount.name,
      domain: testAccount.domain,
      account: testAccount.account,
      accountType: '0',
      internalAccount: testAccount.internalAccount,
    }

    const ret = await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    }).catch(err => err)

    expect(ret).is.instanceof(Error)
    expect(ret.statusCode).is.eq(400)
  })

  it('should be able to update record', async () => {
    const updatingBody = {
      name: `cool_${rand()}`,
      domain: `${domain}2`,
      account: Keypair.random().publicKey(),
      accountType: '1',
      internalAccount: Keypair.random().publicKey(),
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/${testAccount.id}`,
      method: 'PUT',
      body: updatingBody,
      json: true
    })

    const updatedValue = await request({
      uri: `http://localhost:9090/account/${testAccount.id}`,
      method: 'GET',
      body: updatingBody,
      json: true
    })

    testAccount = updatedValue

    expect(updatedValue).to.exist
    expect(updatedValue.name).to.eq(updatingBody.name)
    expect(updatedValue.domain).to.eq(updatingBody.domain)
    expect(updatedValue.account).to.eq(updatingBody.account)
    expect(updatedValue.accountType).to.eq(updatingBody.accountType)
    expect(updatedValue.internalAccount).to.eq(updatingBody.internalAccount)
  })

  it('should return 400 when updating null internal account', async () => {
    const updatingBody = {
      internalAccount: null
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/${testAccount.id}`,
      method: 'PUT',
      body: updatingBody,
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(400)
  })

  it('should return 400 when update invalid account', async () => {
    const updatingBody = {
      account: 'asdfdsf',
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/af67f4c8-dc0a-11e8-9f8b-f2801f1b9fd1`,
      method: 'PUT',
      body: updatingBody,
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(400)
  })

  it('should return 400 when update invalid internal account', async () => {
    const updatingBody = {
      internalAccount: 'asdfdsf',
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/af67f4c8-dc0a-11e8-9f8b-f2801f1b9fd1`,
      method: 'PUT',
      body: updatingBody,
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(400)
  })

  it('should return 404 when update non existing account', async () => {
    const updatingBody = {
      name: `cool_${rand()}`,
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/af67f4c8-dc0a-11e8-9f8b-f2801f1b9fd1`,
      method: 'PUT',
      body: updatingBody,
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(404)
  })

  it('should return 501 for PATCH method', async () => {
    const body = {}

    const updateResult = await request({
      uri: `http://localhost:9090/account/af67f4c8-dc0a-11e8-9f8b-f2801f1b9fd1`,
      method: 'PATCH',
      body,
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(501)
  })

  it('should be able to delete record', async () => {
    const deletedResult = await request({
      uri: `http://localhost:9090/account/${testAccount.id}`,
      method: 'DELETE',
      json: true
    })

    expect(deletedResult).to.eq('OK')
  })

  it('should return 404 when deleting non existing record', async () => {
    const updateResult = await request({
      uri: `http://localhost:9090/account/af67f4c8-dc0a-11e8-9f8b-f2801f1b9fd1`,
      method: 'DELETE',
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(404)
  })

})
