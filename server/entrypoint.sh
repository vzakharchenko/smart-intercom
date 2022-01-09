#!/bin/bash

pm2 start `npm root -g`/intercom-server/index.js
tail -f ~/.pm2/logs/index-error.log
