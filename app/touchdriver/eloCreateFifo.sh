#! /bin/sh

mode="776"
elo_usb_device_path="/dev/elo-usb/"
elo_usb_configdata_path="/etc/opt/elo-usb/ConfigData/"
elo_usb_rspfifo="rsp_fifo"
elo_usb_cmdfifo="cmd_fifo"

rm -f ${elo_usb_device_path}${elo_usb_cmdfifo}
rm -f ${elo_usb_device_path}${elo_usb_rspfifo}

mkdir -p $elo_usb_device_path
mkdir -p $elo_usb_configdata_path

mkfifo ${elo_usb_device_path}$elo_usb_rspfifo 
mkfifo ${elo_usb_device_path}$elo_usb_cmdfifo 

chmod $mode ${elo_usb_device_path}${elo_usb_cmdfifo}
chmod $mode ${elo_usb_device_path}${elo_usb_rspfifo}

