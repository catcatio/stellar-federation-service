#!/bin/bash

ssh root@catcat.io "cd ~/stellar-federation-service && docker-compose down && docker-compose up --build -d"
