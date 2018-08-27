#!/bin/sh
set -e

# ensure running as root
if [ "$(id -u)" != "0" ]; then
  exec sudo "$0" "$@"
fi

echo "You should only need to calibrate once..."
cd /etc/opt/elo-usb
./elova --nvram
cp xEloInit.sh /etc/X11/xinit/xinitrc.d/
