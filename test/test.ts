import 'chai'
import { expect } from 'chai';

import * as request from 'request-promise-native'
import { Keypair } from 'stellar-base/lib/keypair'
import { ECANCELED, POINT_CONVERSION_COMPRESSED } from 'constants';

const rand = () => `${Math.round(Math.random() * 10000)}`

const domain = 'e2etest.ab'

describe('E2E', async () => {
  it('should return 404 if GET non existing user', async () => {
    const ret = await request({
      uri: 'http://localhost:9090/account/00998877665544332211',
      method: 'GET',
      json: true
    }).catch(err => err)

    expect(ret).is.instanceof(Error)
    expect(ret.statusCode).is.eq(404)
  })

  it('should be able to add a new user', async () => {
    const body = {
      name: `cool_${rand()}`,
      domain,
      account: Keypair.random().publicKey()
    }

    const ret = await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    })

    expect(ret.id).to.exist
  })

  it('should be able to get a user by id', async () => {
    const body = {
      name: `cool_${rand()}`,
      domain,
      account: Keypair.random().publicKey()
    }

    const ret = await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    })

    const retAccount = await request({
      uri: `http://localhost:9090/account/${ret.id}`,
      method: 'GET',
      json: true
    })

    expect(retAccount).to.exist
    expect(retAccount.name).to.eq(body.name)
    expect(retAccount.domain).to.eq(body.domain)
    expect(retAccount.account).to.eq(body.account)
    expect(retAccount.accountType).to.eq('0')
    expect(retAccount.internalAccount).to.be.null
  })

  it('should return 400 wehn adding invalid account', async () => {
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
      name: `cool_${rand()}`,
      domain,
      account: Keypair.random().publicKey()
    }

    await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    })

    const ret = await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    }).catch(err => err)

    expect(ret).is.instanceof(Error)
    expect(ret.statusCode).is.eq(400)
  })

  it ('should be able to update record', async () => {
    const body = {
      name: `cool_${rand()}`,
      domain,
      account: Keypair.random().publicKey()
    }

    const ret = await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    })

    const updatingBody = {
      name: `cool_${rand()}`,
      domain: `${domain}2`,
      account: Keypair.random().publicKey(),
      accountType: '1',
      internalAccount: Keypair.random().publicKey(),
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/${ret.id}`,
      method: 'PUT',
      body: updatingBody,
      json: true
    })

    const updatedValue = await request({
      uri: `http://localhost:9090/account/${ret.id}`,
      method: 'GET',
      body: updatingBody,
      json: true
    })

    expect(updatedValue).to.exist
    expect(updatedValue.name).to.eq(updatingBody.name)
    expect(updatedValue.domain).to.eq(updatingBody.domain)
    expect(updatedValue.account).to.eq(updatingBody.account)
    expect(updatedValue.accountType).to.eq(updatingBody.accountType)
    expect(updatedValue.internalAccount).to.eq(updatingBody.internalAccount)
  })

  it ('should be able to update null internal account', async () => {
    const body = {
      name: `cool_${rand()}`,
      domain,
      account: Keypair.random().publicKey()
    }

    const ret = await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    })

    const updatingBody = {
      name: `cool_${rand()}`,
      domain: `${domain}2`,
      account: Keypair.random().publicKey(),
      accountType: '1',
      internalAccount: null,
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/${ret.id}`,
      method: 'PUT',
      body: updatingBody,
      json: true
    })

    const updatedValue = await request({
      uri: `http://localhost:9090/account/${ret.id}`,
      method: 'GET',
      body: updatingBody,
      json: true
    })

    expect(updatedValue).to.exist
    expect(updatedValue.name).to.eq(updatingBody.name)
    expect(updatedValue.domain).to.eq(updatingBody.domain)
    expect(updatedValue.account).to.eq(updatingBody.account)
    expect(updatedValue.accountType).to.eq(updatingBody.accountType)
    expect(updatedValue.internalAccount).to.eq(updatingBody.internalAccount)
  })

  it ('should return 400 when update invalid account', async () => {
    const updatingBody = {
      name: `cool_${rand()}`,
      domain: `${domain}2`,
      account: 'asdfdsf',
      accountType: '1',
      internalAccount: null,
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/6e0b806c235a518c1685fe0a11aee381`,
      method: 'PUT',
      body: updatingBody,
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(400)
  })

  it ('should return 400 when update invalid internal account', async () => {
    const updatingBody = {
      name: `cool_${rand()}`,
      domain: `${domain}2`,
      account: Keypair.random().publicKey(),
      accountType: '1',
      internalAccount: 'asdfdsf',
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/6e0b806c235a518c1685fe0a11aee381`,
      method: 'PUT',
      body: updatingBody,
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(400)
  })

  it ('should return 404 when update non existing account', async () => {
    const updatingBody = {
      name: `cool_${rand()}`,
      domain: `${domain}2`,
      account: Keypair.random().publicKey(),
      accountType: '1',
      internalAccount: Keypair.random().publicKey(),
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/asdfasdfa`,
      method: 'PUT',
      body: updatingBody,
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(400)
  })

  it ('should return 501 for PATCH method', async () => {
    const updatingBody = {
      name: `cool_${rand()}`,
      domain: `${domain}2`,
      account: Keypair.random().publicKey(),
      accountType: '1',
      internalAccount: Keypair.random().publicKey(),
    }

    const updateResult = await request({
      uri: `http://localhost:9090/account/asdfasdfa`,
      method: 'PATCH',
      body: updatingBody,
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(501)
  })

  it ('should be able to delete record', async () => {
    const body = {
      name: `cool_${rand()}`,
      domain,
      account: Keypair.random().publicKey()
    }

    const ret = await request({
      uri: 'http://localhost:9090/account',
      method: 'POST',
      body,
      json: true
    })

    const updateResult = await request({
      uri: `http://localhost:9090/account/${ret.id}`,
      method: 'DELETE',
      json: true
    })

    expect(updateResult).to.eq('OK')
  })

  it ('should return 404 when deleting non existing record', async () => {
    const updateResult = await request({
      uri: `http://localhost:9090/account/55a6220c1c84b5a90a2cb4483cb34a26`,
      method: 'DELETE',
      json: true
    }).catch(err => err)

    expect(updateResult).is.instanceof(Error)
    expect(updateResult.statusCode).is.eq(404)
  })

})
