# smartthings-intercom

- Description: Remotely open an apartment intercom (Cyfral, Visit or similar) using Samsung Smartthings

# Required Electronic Components
 - WeMos D1 Mini ($2.03). [AliExpress](https://aliexpress.com/item/32630518881.html?sku_id=12000018628049611&spm=a2g2w.productlist.0.0.33f717d28p4yT3)
 - 1 channel relay module Delay Disconnection Triggers Delayed Cycle Timing Circuit Switch XY-J02 (2.32$). [AliExpress](https://aliexpress.com/item/4000372163113.html?sku_id=10000001523783321&spm=a2g2w.productlist.0.0.232c5991ZEe6Ny)
 - KY-019 KY 019 5V One 1 Channel Relay Module Board Shield (1.00$). [AliExpress](https://aliexpress.com/item/32727785341.html?sku_id=61353464595&spm=a2g2w.productlist.0.0.67815f4bxXi0ot)
 - micro-usb cable(2.00$)
 - Raspberry Pi or analog ($10.00). [Raspberry Pi](https://www.canakit.com/raspberry-pi-zero-wireless.html?src=raspberrypi)
# Total Price
 - with raspberry PI: 17,35$
 - Without raspberry Pi: 7.35$

# Connection diagram
![](/docs/intercom.drawio.png)

## Server setup using Docker
- Docker Installation:
```bash
docker run -d --name=smartthings-intercom  -p 8099:8099 -p 8098:8098 --restart=always vassio/smartthings-intercom:latest
```
- Docker Installation with configuration out:
```bash
echo "{}"> /opt/config/intercom/intercomConfig.json
docker run -d --name=smartthings-intercom  -p 8099:8099 -p 8098:8098 -v /opt/config/intercom/intercomConfig.json:/opt/config/intercom/intercomConfig.json --restart=always vassio/smartthings-intercom:latest
```
## Manual Server setup
 - required Node 12.x or upper
```bash
sudo npm i pm2 -g
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ${currentUser} --hp ${HOME}
sudo npm i intercom-server -g
sudo pm2 start `npm root -g`/ intercom-server/index.js
sudo pm2 save
```


