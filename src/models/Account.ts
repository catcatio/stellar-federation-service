import {
  Column,
  Model,
  Table,
  PrimaryKey,
  BeforeCreate,
  Is,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  Default
} from 'sequelize-typescript'

import { StrKey } from 'stellar-base/lib/strkey'
import { md5 } from '../utils/cryptoHelper'

@Table({
  tableName: 'account',
  timestamps: true,
  indexes: [
    {
      index: 'name_index',
      unique: true,
      fields: ['name', 'domain']
    },
    {
      index: 'account_index',
      unique: false,
      fields: ['account']
    }
  ]
})
export class Account extends Model<Account> {
  @PrimaryKey
  @Column
  public id: string

  @Is('isValidEd25519PublicKey', (value: string) => {
    if (!StrKey.isValidEd25519PublicKey(value)) {
      throw new Error(`"${value}" is not a valid Ed25519 public key.`);
    }
  })
  @Column
  public account: string

  @Column
  public name: string

  @Column
  public domain: string

  @Default('0')
  @Column
  public accountType: string

  @Is('isValidEd25519PublicKey', (value: string) => {
    if (value != null && !StrKey.isValidEd25519PublicKey(value)) {
      throw new Error(`"${value}" is not a valid Ed25519 public key.`);
    }
  })

  @AllowNull
  @Column
  public internalAccount: string

  @CreatedAt
  public createdAt: Date

  @UpdatedAt
  public updatedAt: Date

  @BeforeCreate
  static setId(instance: Account) {
    instance.id = md5(instance.account)
    console.log(instance.id)
  }
}
