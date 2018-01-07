#!/usr/bin/sh

# Copy driver folder and change permissions
cp -r ../touchdriver/ /etc/opt/elo-usb
cd /etc/opt/elo-usb
chmod 777 *
chmod 444 *.txt
cp /etc/opt/elo-usb/99-elotouch.rules /etc/udev/rules.d

# Startup Driver
./elousbd
./eloautocalib --renew
