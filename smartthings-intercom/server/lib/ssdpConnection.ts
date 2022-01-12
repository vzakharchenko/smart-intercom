import { Client } from 'node-ssdp';
import {RemoteInfo} from "dgram";

export async function findSSDP():Promise<String> {
  return new Promise(async (resolve, reject)=>{
    const client = new Client();
    client.on('response', function (headers, statusCode, rinfo:RemoteInfo) {
      console.log('Got a response to an m-search.');
      resolve(rinfo.address);
    });
    await client.search('urn:intercom:device:vzakharchenko:1');
  })


}
