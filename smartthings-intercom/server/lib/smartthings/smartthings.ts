import {fetchData, sendData} from '../restCalls';

const apiGateWay = (shard: string) => `${shard}/api/smartapps/installations/`;
const apiSmartAppOff = () => '/smartapp/off?access_token=';
const apiGateWayInitUrl = () => '/smartapp/init?access_token=';

export async function smartAppOff(shard: string, appId: string, secret: string): Promise<any> {
    const url = `${apiGateWay(shard)}${appId}${apiSmartAppOff()}${secret}`;
    const ret = await fetchData(
        url,
        'GET',
    );
    return JSON.parse(ret.data);
}

export async function apiGateWayInit(body: any, appId: string, secret: string, shard: string) {
    const url = `${apiGateWay(shard)}${appId}${apiGateWayInitUrl()}${secret}`;
    const ret = await sendData(url, 'POST', JSON.stringify(body),
        {
            'Content-Type': 'application/json',
        });
    return JSON.parse(ret.data);
}
