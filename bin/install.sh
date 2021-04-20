#!/bin/sh -e

ROOT_DIR=$(cd "$(dirname "$(dirname "${BASH_SOURCE[0]}")")" && pwd)

echo "updating and installing your system packages..."
echo "\$ pkg update"
pkg update --yes

echo

echo "\$ pkg install git nodejs --yes"
echo "- do not shutdown the process during installing, which can cause fatal error"
sleep 3
pkg install git nodejs --yes

echo

echo "downloading repository to home directory..."
echo "\$ git clone https://github.com/NweOo22222/smsbot"
git clone "https://github.com/NweOo22222/smsbot" "$HOME/smsbot"

echo "installing..."
npm install
npm run build

if [ -e "$HOME/start" ]
then
    continue
else
    echo "echo \"changing directory into $ROOT_DIR\"" >> "$ROOT_DIR/bin/start.sh"
    echo "cd "$ROOT_DIR"" >> "$ROOT_DIR/bin/start.sh"
    echo "npm start" >> "$ROOT_DIR/bin/start.sh"
    chmod +x "$ROOT_DIR/bin/start.sh"
    ln "$ROOT_DIR/bin/start.sh" "$HOME/start"
fi

echo "Completed!"
echo
echo "Type and hit '~/start' to start chatbot server"
