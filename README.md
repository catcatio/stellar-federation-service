# stellar-federation-service

NodeJS implementation of Stellar Federation Service

## Features

- separate federation and management apis
- support two types of account: federation and individual accounts

## Configuration

see `.env.sample`

```bash
FEDERATION_DB=federationdb
FEDERATION_HOST=federationpg
FEDERATION_USER=user
FEDERATION_PASSWORD=password
FEDERATION_DIALECT=postgres

PGADMIN_USER=user@example.cam
PGADMIN_PASSWORD=password
PGADMIN_PORT=3002

PORT=3000
FED_PORT=3001
```

## Run

```bash
docker-compose up
```

## Management api

### Create record

__request:__

```shell
curl -X POST http://localhost:3000/account \
    -d '{"name": "alice","domain":"localhost","account":"GAGYJN4XRLBLXII3ZNCF6PFH7MJOJK4T4K4HJY3RGVQGIE6M3TFDDP7M","AccountType": "0","internalAccount": "GAGYJN4XRLBLXII3ZNCF6PFH7MJOJK4T4K4HJY3RGVQGIE6M3TFDDP7M"}' \
    -H "Content-Type: application/json"
```

__response:__

`200`

```json
{
  "id":"7c26a65d-9bce-4bd0-a5bc-c5a46e615604",
  "name":"alice",
  "domain":"localhost",
  "account":"GBRRZ5OIVFW4JGXK7C5DYTL3VOBLZ46YPELXFTGBPSQQVGBQJ3K4G6ZG",
  "accountType":"0",
  "internalAccount":"GB53IMRSJ64363VE37RTIVMX7H5NUZOYOBPDJ46FWINYR4FGRF6XADLX",
  "internalAccountHash":"bebd7043c0cb70521a7335506693e89e"
}
```

`400` `Validation error`

### Retrieve record

__request:__

```shell
curl -X GET http://localhost:3000/account/7c26a65d-9bce-4bd0-a5bc-c5a46e615604
```

__response:__

`200`

```json
{
  "id":"7c26a65d-9bce-4bd0-a5bc-c5a46e615604",
  "name":"alice",
  "domain":"localhost",
  "account":"GBRRZ5OIVFW4JGXK7C5DYTL3VOBLZ46YPELXFTGBPSQQVGBQJ3K4G6ZG",
  "accountType":"0",
  "internalAccount":"GB53IMRSJ64363VE37RTIVMX7H5NUZOYOBPDJ46FWINYR4FGRF6XADLX",
  "internalAccountHash":"bebd7043c0cb70521a7335506693e89e"
}
```

`400` `Validation error`

### Update record

__request:__

```shell
curl -X PUT http://localhost:3000/account/7c26a65d-9bce-4bd0-a5bc-c5a46e615604 \
    -d '{"name": "alice","domain":"localhost","account":"GBONGOWPP465BTETLNONFFW7WWMFWM2BPKVZCONNG423MWHM7Z7C5HA5","AccountType": "0","internalAccount": "GCQ2MMOPEZJ7DBEPTZADWWHIZCSI3FMYM7URHQBYPCGOXC2FLGWU63K3"}' \
    -H "Content-Type: application/json"
```

__response:__

`200`

```text
OK
```

`400` `Validation error`

`404` `Not Found`

### Delete record

__request:__

```shell
curl -X DELETE http://localhost:3000/account/7c26a65d-9bce-4bd0-a5bc-c5a46e615604
```

__response:__

`200`

```text
OK
```

`404` `Not Found`

## Federation api

### Get account by name

__request:__

```shell
curl http://localhost:3001/federation/?q=alice*loalhost&type=name
```

__response:__

`200`

```json
{
"stellar_address": "alice*localhost",
"account_id": "GAGYJN4XRLBLXII3ZNCF6PFH7MJOJK4T4K4HJY3RGVQGIE6M3TFDDP7M",
"memo": "3136326232623232636564616239653337643733386531383964356361333766",
"memo_type": "hash"
}
```

`404` `Not Found`

### Get account by account id

__request:__

```shell
curl http://localhost:3001/federation/?q=GAGYJN4XRLBLXII3ZNCF6PFH7MJOJK4T4K4HJY3RGVQGIE6M3TFDDP7M&type=id
```

__response:__

`200`

```json
{
"stellar_address": "alice*localhost",
"account_id": "GAGYJN4XRLBLXII3ZNCF6PFH7MJOJK4T4K4HJY3RGVQGIE6M3TFDDP7M",
"memo": "3136326232623232636564616239653337643733386531383964356361333766",
"memo_type": "hash"
}
```

`404` `Not Found`
