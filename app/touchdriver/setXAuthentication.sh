#! /bin/sh

elo_xauth_log="/var/log/elo-usb/EloXAuthLog.txt"  #Log file name

echo "$0: Starting Elo USB X authentication script" > $elo_xauth_log

if [ x"$ELOUSB_X_STARTUP" != x ]; then
  echo "$0: System startup detected ["$ELOUSB_X_STARTUP"]" >> $elo_xauth_log
  echo "$0: Wait 10 seconds before proceeding, to allow X to load completely." >> $elo_xauth_log
  sleep 10
fi

# sleep 2            # Add (2 to 5) second delay for successful Xwindows authentication for SLES 12

xauth_command=
if [ -x /usr/X11R6/bin/xauth ]; then
xauth_command=/usr/X11R6/bin/xauth
elif [ -x /usr/bin/xauth ]; then
xauth_command=/usr/bin/xauth
else
echo "$0: Can't find the xauth command. Aborting authentication script." >> $elo_xauth_log
exit 1
fi

#xauth_command=`which xauth` // Try using this to get xauth if not found in the above locations 
#sudo_command=`which sudo`   // Use the sudo command if necessary

current_display=:0
magic_cookie=$1

echo "$0: Current XAUTHORITY env path is:" $XAUTHORITY >> $elo_xauth_log

if [ x"$XAUTHORITY" = x ]; then
 XAUTHORITY=$HOME/.Xauthority
 export XAUTHORITY
 echo "$0: Modified XAUTHORITY env path is:" $XAUTHORITY >> $elo_xauth_log
fi

user_xauth_full_file=$XAUTHORITY

echo "$0: Current Display (Default):" $current_display >> $elo_xauth_log
echo "$0: Xauth command location :" $xauth_command >> $elo_xauth_log

echo "$0: User XAUTHORIZATION File with full path:" $user_xauth_full_file >> $elo_xauth_log

echo "$0: Current Xwindow session's magic cookie:" $magic_cookie >> $elo_xauth_log

if [ -w "$user_xauth_full_file" ]; then 
  echo "$0: User xauth file exists and is writable" >> $elo_xauth_log
else
  echo "$0: User xauth file does not exist. Creating new file." >> $elo_xauth_log
  echo -n >$user_xauth_full_file
fi
 
echo "$0: Updating xauth file:" >> $elo_xauth_log
$xauth_command -f $user_xauth_full_file add $current_display . $magic_cookie

echo "$0: Xauth File Info:" >> $elo_xauth_log
$xauth_command -f $user_xauth_full_file info >> $elo_xauth_log
echo "$0: Xauth File Listing:" >> $elo_xauth_log
$xauth_command -f $user_xauth_full_file list >> $elo_xauth_log

echo "$0: Completed Elo USB X authentication script" >> $elo_xauth_log
