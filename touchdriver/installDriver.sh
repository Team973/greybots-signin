#!/bin/sh
set -e

# ensure running as root
if [ "$(id -u)" != "0" ]; then
  exec sudo "$0" "$@"
fi

echo "Installing driver. System will reboot."
rm -rf /etc/opt/elo-usb                # Remove old driver.
mkdir -rp /etc/opt/elo-usb
cp -r ./driver/* /etc/opt/elo-usb      # Copy new driver.
cd /etc/opt/elo-usb                    # Move to the driver folder.
chmod 777 *                            # Make all files read/write.
chmod 444 *.txt                        # Protect info files.
cp 99-elotouch.rules /etc/udev/rules.d # Copy elo rules.
cp elo.service /etc/systemd/system/    # Copy elo startup service.
systemctl enable elo.service           # Enable elo service.
shutdown -r now                        # Reboot
