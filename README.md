# smart-intercom

- [![docker](https://github.com/vzakharchenko/smart-intercom/actions/workflows/docker.yml/badge.svg)](https://github.com/vzakharchenko/smart-intercom/actions/workflows/docker.yml)
- [![Node.js CI](https://github.com/vzakharchenko/smart-intercom/actions/workflows/node.yml/badge.svg)](https://github.com/vzakharchenko/smart-intercom/actions/workflows/node.yml)
- ![npm](https://img.shields.io/npm/v/intercom-server?label=intercom-server)
- ![GitHub release (latest by date)](https://img.shields.io/github/v/release/vzakharchenko/smart-intercom?style=for-the-badge)
- ![Docker Image Version (latest by date)](https://img.shields.io/docker/v/vassio/smartthings-intercom?arch=amd64&label=Docker)

- Description: Remotely open an apartment intercom (Cyfral, Visit or similar)

## Features
 - When the device is inactive or turned off, it does not interfere with the operation of the intercom
 - Can be integrated with various types of smart home systems
 - Integrated with [Samsung Smartthings](./smartthings-intercom)

# Required Electronic Components
 - WeMos D1 Mini ($2.03). [AliExpress](https://aliexpress.com/item/32630518881.html?sku_id=12000018628049611&spm=a2g2w.productlist.0.0.33f717d28p4yT3)
 - 1 channel relay module Delay Disconnection Triggers Delayed Cycle Timing Circuit Switch XY-J02 (2.32$). [AliExpress](https://aliexpress.com/item/4000372163113.html?sku_id=10000001523783321&spm=a2g2w.productlist.0.0.232c5991ZEe6Ny)
 - KY-019 KY 019 5V One 1 Channel Relay Module Board Shield (1.00$). [AliExpress](https://aliexpress.com/item/32727785341.html?sku_id=61353464595&spm=a2g2w.productlist.0.0.67815f4bxXi0ot)
 - micro-usb cable(2.00$)
# Total Price
 7.35$

# Connection diagram
![](/docs/intercom.drawio.png)

# XY-J02 settings
- **Operating Mode**: P.2
- **OP**: 2 sec
- **CL**: 4 sec

# Wemos D1 mini firmware

- Download firmware from https://github.com/vzakharchenko/smart-intercom/releases
```bash
sudo apt-get install -y esptool
esptool --port /dev/ttyUSB0 write_flash --flash_size=detect -fm dout 0x0 intercom.ino.d1_mini.bin
```

# First time configuration
- Connect to WiFi network "IntercomAP" and setup connection to your WiFi network

# Rest Api
## activate relay and wait for someone to call the intercom, then open the door
- endpoint
```
http://<DEVICE_IP>/open?timeout=30000
```

where
 - **timeout** - how many time (in millisecond) wait for the call(default 30sec)

# Smartthings Integration
 [Smartthings Integration](./smartthings-intercom)




