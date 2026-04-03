#!/usr/bin/env bash

# Matches rippling-webapp pattern: only install husky hooks in local dev
if [[ ($CI != 'true' && $NODE_ENV != 'production' && $NODE_ENV != 'test') ]];
then
  npm exec husky install
fi
