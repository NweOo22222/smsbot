#!/bin/sh -e

REPO_NAME=smsbot
REPO_PATH=$HOME/$REPO_NAME

function terminate {
    echo 'SMSBot has been shutdown!'
    exit
}

trap terminate exit

xdg-open http://localhost:3001

if [ -d "$REPO_PATH" ]
then
    echo "\033[1;44;37m NWEOO \033[1;46;30m SMSBot \033[0m starting..."
    echo
    cd "$REPO_PATH" &&
    npm start
fi
