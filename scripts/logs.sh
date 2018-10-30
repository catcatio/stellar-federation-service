#!/bin/bash

ssh root@catcat.io "cd ~/stellar-federation-service && docker-compose exec federation-service pm2 logs"
