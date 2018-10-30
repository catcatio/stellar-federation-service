#!/bin/bash

echo "startup.sh"
echo $NODE_ENV

npm i
pm2-runtime start pm2.json --web ${PM2_PORT}
