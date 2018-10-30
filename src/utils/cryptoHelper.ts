import * as crypto from 'crypto'

const md5 = (dataStr) => crypto
  .createHash('md5')
  .update(dataStr, 'utf8')
  .digest('hex')

const memoHash = (hashData) => Buffer.from(hashData).toString('hex')

export {
  md5,
  memoHash
}

