import fs from 'fs';

export type ConfigServer = {
    port: number,
}
export type ConfigSmartthings = {
    port:number,
    timeout:number,
    deviceIp?:string,
    appId?:string,
    secret?:string
    label?:string
    shard?:string
}
export type ConfigJson = {
    server: ConfigServer,
    smartapp: String[],
    configFile?:string,
    smartthings:ConfigSmartthings,
}


export async function config(): Promise<ConfigJson> {
    const configJson:ConfigJson = {
        server: {
            port: 8099,
        },
        smartapp: [
            'https://graph.api.smartthings.com',
            'https://graph-na02-useast1.api.smartthings.com',
            'https://graph-na04-useast2.api.smartthings.com',
            'https://graph-eu01-euwest1.api.smartthings.com',
            'https://graph-ap02-apnortheast2.api.smartthings.com',
        ],
        smartthings:{
            port:8098,
            timeout:180000,
        }
    };
    const defaultConfigFile = `${process.env.HOME}/config/intercomConfig.json`;
    if (fs.existsSync(defaultConfigFile)) {
        const overrideConfig = JSON.parse(await fs.promises.readFile(defaultConfigFile, 'utf8') || '{}');
        Object.assign(configJson, overrideConfig);
        Object.assign(configJson, {configFile: defaultConfigFile});
    }
    const ovverideConfigFile = './config/intercomConfig.json';
    if (fs.existsSync(ovverideConfigFile)) {
        const overrideConfig = JSON.parse(await fs.promises.readFile(ovverideConfigFile, 'utf8') || '{}');
        Object.assign(configJson, overrideConfig);
        Object.assign(configJson, {configFile: ovverideConfigFile});
    }
    const configFile = '/opt/config/intercomConfig.json';
    if (fs.existsSync(configFile)) {
        const overrideConfig = JSON.parse(await fs.promises.readFile(configFile, 'utf8') || '{}');
        Object.assign(configJson, overrideConfig);
        Object.assign(configJson, {configFile});
    }
    const configFile2 = '/opt/config/intercom/config.json';
    if (fs.existsSync(configFile2)) {
        const overrideConfig = JSON.parse(await fs.promises.readFile(configFile2, 'utf8') || '{}');
        Object.assign(configJson, overrideConfig);
        Object.assign(configJson, {configFile: configFile2});
    }
    const configFile3 = '/opt/config/intercom/intercomConfig.json';
    if (fs.existsSync(configFile3)) {
        const overrideConfig = JSON.parse(await fs.promises.readFile(configFile3, 'utf8') || '{}');
        Object.assign(configJson, overrideConfig);
        Object.assign(configJson, {configFile: configFile3});
    }
    if (!configJson.server) {
        configJson.server = {
            port: 8099,
        };
    }
    if (!configJson.smartthings) {
        configJson.smartthings = {
            port:8098,
            timeout:180000,
        };
    }
    if (!configJson.smartthings.timeout){
        configJson.smartthings.timeout=180000;
    }
    if (!configJson.smartapp) {
        configJson.smartapp = [
            'https://graph.api.smartthings.com',
            'https://graph-na02-useast1.api.smartthings.com',
            'https://graph-na04-useast2.api.smartthings.com',
            'https://graph-eu01-euwest1.api.smartthings.com',
            'https://graph-ap02-apnortheast2.api.smartthings.com',
        ];
    }
    return configJson;
};

export async function saveConfig(changeConfig:ConfigJson) {
    const currentConfig = await config();
    const updatedConfig = {...currentConfig, ...changeConfig};
    delete updatedConfig.configFile;
    let configFile = currentConfig.configFile;
    if (!configFile || currentConfig.configFile === './config/intercomConfig.json') {
        fs.mkdirSync(`${process.env.HOME}/config/`, {recursive: true});
        configFile = `${process.env.HOME}/config/intercomConfig.json`;
    }
    await fs.promises.writeFile(configFile, JSON.stringify(updatedConfig, null, 1));
}
