import {CronJob} from 'cron';

import {
  config, saveConfig,
} from './env';
import {findSSDP} from "./ssdpConnection";
import {smartAppCheckState} from "./smartthings/smartthings";
import {execute} from "./smartthings/ServiceBackend";

export async function installCrons() {
  const cronJob = new CronJob((await config()).server.ssdpJob, (async () => {
    const deviceIp = await findSSDP();
    const currentConfig = await config();
    if (deviceIp && deviceIp !== '' && currentConfig.smartthings.deviceIp !== deviceIp) {
      // @ts-ignore
      currentConfig.smartthings.deviceIp = deviceIp;
      await saveConfig(currentConfig);
    }
  }), null, true, 'America/Los_Angeles');
  // @ts-ignore
  console.info('System TZ next 5: ', cronJob.nextDates(5).map((mom) => mom.toDate()).join(","));

  const cronJob2 = new CronJob((await config()).server.checkJob, (async () => {
    const currentConfig = await config();
    if (currentConfig.smartthings.appId && currentConfig.smartthings.secret && currentConfig.smartthings.deviceIp && currentConfig.smartthings.shard) {
      const currentState = await smartAppCheckState(currentConfig.smartthings.shard, currentConfig.smartthings.appId, currentConfig.smartthings.secret);
      if (currentState.state.value === "on") {
        await execute();
      }
    }
  }), null, true, 'America/Los_Angeles');
  // @ts-ignore
  console.info('System TZ next 5: ', cronJob2.nextDates(5).map((mom) => mom.toDate()).join(","));
}
