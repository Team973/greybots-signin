#! /bin/sh

# Create Elo Devices for communication
/etc/opt/elo-usb/eloCreateFifo.sh

# Load the Elo USB Touchscreen Driver Daemon into memory
/etc/opt/elo-usb/elousbd --xwarppointer
