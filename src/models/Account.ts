import {
  Column,
  Model,
  Table,
  PrimaryKey,
  BeforeCreate,
  Is,
  CreatedAt,
  UpdatedAt,
  Default,
  DataType,
  BeforeUpdate,
  Comment
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
      index: 'domain_index',
      unique: false,
      fields: ['domain']
    },
    {
      index: 'account_index',
      unique: false,
      fields: ['account']
    },
    {
      index: 'hash_index',
      unique: true,
      fields: ['internalAccountHash']
    }
  ]
})
export class Account extends Model<Account> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id: string

  @Column({ allowNull: false })
  public name: string

  @Column({ allowNull: false })
  public domain: string

  @Is('isValidEd25519PublicKey', (value: string) => {
    if (!StrKey.isValidEd25519PublicKey(value)) {
      throw new Error(`"${value}" is not a valid Ed25519 public key.`);
    }
  })
  @Comment('public account id for federation api')
  @Column({ allowNull: false })
  public account: string

  @Default('0')
  @Comment('0: basic, 1: semi, 2: indy')
  @Column({ allowNull: false })
  public accountType: string

  @Is('isValidEd25519PublicKey', (value: string) => {
    if (!StrKey.isValidEd25519PublicKey(value)) {
      throw new Error(`"${value}" is not a valid Ed25519 public key.`);
    }
  })
  @Comment('account id for internal api')
  @Column({ allowNull: false })
  public internalAccount: string

  @Column({ allowNull: false })
  public internalAccountHash: string

  @CreatedAt
  public createdAt: Date

  @UpdatedAt
  public updatedAt: Date

  @BeforeCreate
  @BeforeUpdate
  static setHash(instance: Account) {
    console.log('sethash', instance.internalAccountHash)
    if (!instance.internalAccount) {
      throw new Error(`"Cannot set internalAccountHash, internalAccount is null or empty`);
    }
    instance.internalAccountHash = md5(instance.internalAccount)
    console.log('sethash', instance.internalAccountHash)
  }
}
