import express from 'express';
import bodyParser from 'body-parser';
import {config, ConfigJson} from "../env";
import {fetchData} from "../restCalls";
import {smartAppOff} from "./smartthings";

let server:any;

export async function startApplication() {
  const configJson:ConfigJson = await config();
  if (configJson.smartthings.appId && configJson.smartthings.secret && configJson.smartthings.deviceIp && configJson.smartthings.shard) {
    if (server) {
      server.close();
    }

    const app = express();
    app.set('trust proxy', () => true);
    app.use(bodyParser.json());
    app.use(bodyParser.text());

    app.get(`/${configJson.smartthings.appId}/${configJson.smartthings.secret}/execute`, async (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const rc = await config();
      const deviceIp = rc.smartthings.deviceIp;
      try {
        await fetchData(`http://${deviceIp}/open?timeout=180000`);
      } catch (e:any) {
        console.log(e.message, e)
        res.end(JSON.stringify({ status: 'FAIL', message: e.message }));
      } finally {
          if (rc.smartthings.appId && rc.smartthings.secret && rc.smartthings.deviceIp && rc.smartthings.shard) {
            await smartAppOff(rc.smartthings.shard,rc.smartthings.appId, rc.smartthings.secret);
          }
      }
      res.end(JSON.stringify({ status: 'OK' }));
    });

    server = app.listen(configJson.smartthings.port, () => {
      console.info(`HTTP smartthings phevctl listening on port ${configJson.smartthings.port}`);
    });
  }
}
