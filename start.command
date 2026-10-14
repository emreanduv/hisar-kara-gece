#!/bin/bash
# Çift tıkla: sunucuyu açar ve oyunu tarayıcıda başlatır.
cd "$(dirname "$0")"
( sleep 1.5; open "http://127.0.0.1:${CC_PORT:-8768}" ) &
./yayin-7-24.sh
