#!/bin/bash -e

onExit() {
    echo 'System Shutdown!'
    exit
}

trap onExit exit

xdg-open http://localhost:3001
