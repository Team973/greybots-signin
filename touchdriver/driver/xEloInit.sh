#!/bin/sh
#
# Link this file: ln -s /etc/opt/elo-usb/xEloInit.sh /etc/X11/xinit/xinitrc.d/xEloInit.sh
#

elousbd_PID=`ps -C elousbd -o pid=`

eloautocalib_PID=`ps -C eloautocalib -o pid=`
 
if [ -n "$eloautocalib_PID" ]; then
	echo 'Killing existing eloautocalib processes in memory'
	killall eloautocalib
fi

# Uncomment the '/etc/opt/elo-usb/eloautocalib' line entry below to load the calibration values from 
# the monitor NVRAM on system startup. Type "# /etc/opt/elo-usb/eloautocalib --help" at command prompt for 
# help and options on eloautocalib utility.

# eloautocalib - not active [Default] - Does not read and apply calibration values from NVRAM.   
# eloautocalib - active               - Read calibration values from NVRAM and apply automatically. 

# Only start'eloautocalib' if 'elousbd' is running.
if [ -n "$elousbd_PID" ]; then
 # echo 'Loading Elo touch screen calibration data'
 # /etc/opt/elo-usb/eloautocalib --renew
fi
