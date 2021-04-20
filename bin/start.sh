#!/bin/bash -e

onExit() {
    echo 'System Shutdown!'
    exit
}

onStart() {
    npm start
}

trap onExit exit

xdg-open http://localhost:3001
