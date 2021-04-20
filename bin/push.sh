#!/bin/bash
VERSION=v1.2
node bin/push.js
git add .
git commit -m "${1:-'updated'}"
git push origin $VERSION
