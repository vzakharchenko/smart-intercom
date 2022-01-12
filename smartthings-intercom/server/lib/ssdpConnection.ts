import {RemoteInfo} from "dgram";

import {Client} from 'node-ssdp';

export function findSSDP():Promise<string> {
  return new Promise((resolve, reject) => {
    const client = new Client();
    let resp = false;
    client.on('response', (headers, statusCode, rinfo:RemoteInfo) => {
      console.log(`Got a response to an m-search: Intercom Device IP is ${rinfo.address}`);
      resolve(rinfo.address);
      resp = true;
      client.stop();
    });
    setTimeout(() => {
      if (resp) {
        return;
      }
      console.log('Does not get a response to an m-search');
      resolve("");
      client.stop();

    }, 5000);

     // @ts-ignore
    client.search('urn:intercom:device:vzakharchenko:1').then(() => {
      console.log('Starting search Intercom Device: urn:intercom:device:vzakharchenko:1');
    }).catch(() => reject);

  });


}
