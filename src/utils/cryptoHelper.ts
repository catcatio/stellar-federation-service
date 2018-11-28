import * as crypto from 'crypto'

/**
 * generate md5 from given text
 * @param text text to be converted
 */
const md5 = (text) => crypto
  .createHash('md5')
  .update(text, 'utf8')
  .digest('hex')

/**
 * convert hash string to hex format
 * @param hash hash string to be converted
 */
const memoHash = (hash) => Buffer.from(hash).toString('hex')

export {
  md5,
  memoHash
}

