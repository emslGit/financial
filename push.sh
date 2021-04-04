#!/bin/sh
if [ -z "$1" ]; then
  echo "please supply commit message"
  sleep 3s
  exit
fi
npm run deploy
git add .
git commit -m "$1"
git push