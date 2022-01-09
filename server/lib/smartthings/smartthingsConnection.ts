import { apiGateWayInit } from './smartthings';
import { config } from '../env';

export type InitData = {
  initialization: number,
}


async function smartthingsInit0(initData:InitData, shard:string, appId:string, secret:string) {
 return await apiGateWayInit(initData, appId, secret, shard)
}

function getInitData():InitData {
  return {
    initialization: new Date().getTime(),
  };
}

export async function smartthingsInit() {
  const initData = getInitData();
  const { smartthings } = await config();
  if (!smartthings.shard || !smartthings.appId || !smartthings.secret){
    throw new Error("Application does not initialized. Please install smartthings smartapp first")
  }
  return await smartthingsInit0(initData, smartthings.shard, smartthings.appId, smartthings.secret)
}

export async function deviceInit(shard:string, appId:string, secret:string) {
  const initData = getInitData();
  return await smartthingsInit0(initData, shard, appId, secret);
}
