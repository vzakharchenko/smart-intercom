# smartthings-intercom

## Installation Steps

1. [Custom Device Handler installation](./#custom-device-handler-installation)
2. [SmartApp installation](./#smartapp-installation)
3. [Server Installation](./server)
4. [add smartapp to your location using phone application or web portal](./#added-smartapp-to-your-location)

## Custom Device Handler installation
1. open [https://graph.api.smartthings.com/location/list](https://graph.api.smartthings.com/location/list)
2. select your location ![](../docs/intercom1.png)
3. select "My Device Handlers" ![](../docs/intercom2.png)
4. create a new device handler from the [dht/Intercom.groovy](./dht/Intercom.groovy) ![](../docs/intercom3.png) ![](../docs/intercom4.png)
5. publish "For Me" ![](../docs/intercom5.png)

## SmartApp installation
1. open [https://graph.api.smartthings.com/location/list](https://graph.api.smartthings.com/location/list)
2. select your location ![](../docs/intercom1.png)
3. select "My Smartapps" ![](../docs/intercom6.png)
4. add a new smartapp from [smartapps/intercom-ctrl.groovy](./smartapps/intercom-ctrl.groovy) ![](../docs/intercom7.png) ![](../docs/intercom8.png)
5. enable oauth ![](../docs/intercom9.png) ![](../docs/intercom10.png)
6. publish "For Me" ![](../docs/intercom11.png)

## added smartapp to your location

1. [Install Server](./server/README.md)
2. open [https://my.smartthings.com/](https://my.smartthings.com/)
3. add "Groovy SmartApp" ![](../docs/intercom12.png)
4. add "Intercom App" ![](../docs/intercom13.png) ![](../docs/intercom14.png)

## How to Get Application Id and Secret

1. open [https://my.smartthings.com/](https://my.smartthings.com/)
2. select Automations ![](../docs/intercom16.png)
3. select intercom app ![](../docs/intercom17.png)
4.  "Server Info" ![](../docs/intercom18.png)
