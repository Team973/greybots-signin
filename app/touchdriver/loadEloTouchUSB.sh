#! /bin/sh

# Create Elo Devices for communication
/etc/opt/elo-usb/eloCreateFifo.sh

# Load the PC speaker kernel module into memory for Beep-On-Touch 
modprobe pcspkr
sleep 1

# Load the Elo USB Touchscreen Driver Daemon into memory 
/etc/opt/elo-usb/elousbd --xwarppointer
