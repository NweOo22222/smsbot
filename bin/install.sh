#!/bin/sh -e

REPO_NAME=smsbot
REPO_PATH=$HOME/$REPO_NAME

NODEJS_MODULE=0
answer=''

function ask {
    local QUESTION=${1:-''}
    local HINT=${2:-'[Y/n]'}
    echo "\033[0;1;2m\033[0m${QUESTION}\033[0;2m${HINT}\033[0m\r"
    read answer
}

function pkg_install {
    echo "updating your system packages."
    echo " \$ pkg update --yes"
    pkg update --yes
    
    echo "installing core packages: nodejs, git."
    echo " > do not interupt this process while installing, hit Ctrl+C to cancel stop before installing"
    echo "  installing in 3 seconds"
    sleep 1
    echo "  installing in 2 seconds..."
    sleep 1
    echo "  installing in 1 seconds..."
    sleep 1
    echo " \$ pkg install nodejs git --yes"
    pkg install nodejs git --yes
}

function git_clone {
    echo
    echo " \$ git clone https://github.com/NweOo22222/$REPO_NAME $REPO_NAME --single-branch --depth 1"
    git clone "https://github.com/NweOo22222/$REPO_NAME" "$REPO_PATH" --single-branch --depth 1
    echo
    echo " \$ npm install"
    cd "$REPO_PATH" && npm install
    echo
    echo
    ln -s "$REPO_PATH/bin/start.sh" "$HOME/start"
    echo "NweOo SMSBot is successfully installed on your device!"
    echo " > type command '~/start' to start your server"
}

function terminate {
    if [[ "$NODEJS_MODULE" = "0" ]]
    then
        pkg_install
    fi
    git_clone
}

if [ -d "$REPO_PATH" ]
then
    echo "already existed at "$HOME"."
    echo " > to remove existing, type and hit command 'rm -rf "$ROOT_DIR"'."
    exit 1
fi

trap 'terminate' EXIT

test "$(command -v node)"

NODEJS_MODULE=1
