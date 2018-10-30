import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  BeforeCreate,
  Is
} from 'sequelize-typescript'

import { StrKey } from 'stellar-base/lib/strkey'
import { md5 } from '../utils/cryptoHelper';

@Table({
  tableName: 'account',
  timestamps: true,
})
export class Account extends Model<Account> {
  @PrimaryKey
  @Column
  public id: string

  @Is('isValidEd25519PublicKey', (value: string) => {
    if (!StrKey.isValidEd25519PublicKey(value)) {
      throw new Error(`"${value}" is not a valid Ed25519 public key.`);
    }
    console.log("isValidEd25519PublicKey", true)
  })
  @Column
  public account: string

  @Column
  public name: string

  @Column
  public domain: string

  @Column(DataType.CHAR)
  public accountType: string

  @BeforeCreate
  static setId(instance: Account) {
    instance.id = md5(instance.account)
    console.log(instance.id)
  }
}
