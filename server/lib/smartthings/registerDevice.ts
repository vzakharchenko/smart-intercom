import { deviceInit } from './smartthingsConnection';
import {startApplication} from "./ServiceBackend";

const { config, saveConfig } = require('../env');


export type SuccessCallback = (currentShard:string)=>Promise<void>|void;

export async function checkShard(shards:string[], currentShard:string, appId:string, secret:string, successCallback:SuccessCallback) {
  if (currentShard) {
    try {
      console.log("test Shard "+currentShard);
      await deviceInit(currentShard, appId, secret);
      await successCallback(currentShard);
    } catch (ex:any){
      console.log("test Shard error"+ex.message, ex);
      const nextShard = shards.pop();
      if (nextShard){
        await checkShard(shards, nextShard, appId, secret, successCallback);
      } else {
        await successCallback("")
      }
    }
  } else {
    successCallback("");
  }
}

export async function saveSmartThingDeviceInfo(req:any, res:any) {
  const curConfig = { ... await config() };
  const { smartthings, smartapp } = curConfig;
  const { appId, secret, deviceIp, label  } = req.query;
  smartthings.appId = appId;
  smartthings.secret = secret;
  smartthings.label = label;
  smartthings.deviceIp = deviceIp;
  const shards = JSON.parse(JSON.stringify(smartapp));
  const shard = shards.pop();
  await checkShard(shards, shard, appId, secret, async (currentShard:string) => {
    smartthings.shard = currentShard;
    await saveConfig(curConfig);
    await startApplication();
    res.end(JSON.stringify({ status: 'OK' }));
  });
}

