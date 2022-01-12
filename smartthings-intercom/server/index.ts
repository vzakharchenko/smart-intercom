import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import {saveConfig, config, ConfigJson} from './lib/env';
import {saveSmartThingDeviceInfo} from "./lib/smartthings/registerDevice";
import {startApplication} from "./lib/smartthings/ServiceBackend";
import {findSSDP} from "./lib/ssdpConnection";
import {installCrons} from "./lib/cronConnection";

const corsOptions = {
  origin(o:any, callback:any) {
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  maxAge: 3600,
};

config().then(async (currentConfig:ConfigJson) => {
  const {port} = currentConfig.server;

  const server = express();
  server.use(bodyParser.json());
  server.use(cors(corsOptions));

  server.get('/health', (req:any, res:any) => {
    const status = {status: 'OK'};
    res.send(JSON.stringify(status));
  });

  server.get('/registerDevice', async (req:any, res:any) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    await saveSmartThingDeviceInfo(req, res);
  });

  server.listen(port, () => {
    console.info(`HTTP intercom listening on port ${port}`);
  });
  const deviceIp = await findSSDP();
  if (currentConfig.smartthings.deviceIp !== deviceIp) {
    // @ts-ignore
    currentConfig.smartthings.deviceIp = deviceIp;
    await saveConfig(currentConfig);
  }
  await installCrons();
  await startApplication();
}).catch((e:any) => {
  throw new Error(`Configuration issue ${e}`);
});
