# smartthings intercom-server

## Before Install Server
- Create a device according to the [scheme](https://github.com/vzakharchenko/smart-intercom)
![](https://github.com/vzakharchenko/smart-intercom/raw/master/docs/intercom.drawio.png)
- install [Custom Device Handler](https://github.com/vzakharchenko/smart-intercom/tree/master/smartthings-intercom#custom-device-handler-installation)
- install [Smartapp](https://github.com/vzakharchenko/smart-intercom/tree/master/smartthings-intercom#smartapp-installation)

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

## Server Configuration

```json
{
 "server": {
  "port": 8099
 },
 "smartapp": [
  "https://graph.api.smartthings.com",
  "https://graph-na02-useast1.api.smartthings.com",
  "https://graph-na04-useast2.api.smartthings.com",
  "https://graph-eu01-euwest1.api.smartthings.com",
  "https://graph-ap02-apnortheast2.api.smartthings.com"
 ],
 "smartthings": {
  "port": 8098,
  "appId": "<APPLICATION_ID>",
  "secret": "<APPLICATION_SECRET>",
  "label": "intercom",
  "deviceIp": "<DEVICE_IP>",
  "shard": "https://graph-eu01-euwest1.api.smartthings.com",
  "timeout": 1200000
 }
}
```
where
- DEVICE_IP - IP address of WEMOS D1 mini
- APPLICATION_ID - [Application ID](https://github.com/vzakharchenko/smart-intercom/tree/master/smartthings-intercom#how-to-get-application-id-and-secret)
- APPLICATION_SECRET - [Application Secret](https://github.com/vzakharchenko/smart-intercom/tree/master/smartthings-intercom#how-to-get-application-id-and-secret)
