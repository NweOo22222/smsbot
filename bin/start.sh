#!/bin/bash -e

REPO_NAME=smsbot
REPO_PATH=$HOME/$REPO_NAME

function terminate {
    echo 'SMSBot has been shutdown!'
    exit
}

intro() {
    echo "\033[1;44;37m NWEOO \033[1;46;30m SMSBot \033[0m starting..."
    echo
}

launch() {
    URL=http://localhost:${PORT:-'3001'}
    if [[ -e $(command -v xdg-open) ]]
    then
        xdg-open "$URL"
    elif [[ -e $(command -v open) ]]
    then
        open "$URL"
    fi
}

trap terminate exit

if [ -d "$REPO_PATH" ]
then
    intro
    launch
    cd "$REPO_PATH" && npm start
else
    if [ -d "./$REPO_NAME"]
    then
        intro
        launch
        cd "./$REPO_NAME" && npm start
    else
        exit 1
    fi
fi
