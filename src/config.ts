import * as storage from 'electron-json-storage';
import DefaultConfig from './Entities/DefaultConfig';
import { error } from 'util';
const configPara = {
    "default": {
        "languageSource": "zh",
        "languageTarget": "en"
    },
    "languageSource": [
        {
            "name": "English",
            "value": "en"
        },
        {
            "name": "中文",
            "value": "zh"
        }
    ],
    "languageTarget": [
        {
            "name": "English",
            "value": "en"
        }
    ],
    "languageDetail": [
        {
            "source": "zh",
            "target": "en",
            "name": "Longmen",
            "value": "longmen",
            "function": "GetLongmenWord"
        }
    ]
}
async function initConfig() {
    let hasKeyPromise = new Promise<boolean>(resolve => {
        storage.has('config', (error, result) => {
            if (error) throw error;
            resolve(result);
        });
    });
    let hasKey = await hasKeyPromise;
    if (hasKey == false) {
        let config = new DefaultConfig();
        config.source = configPara.default.languageSource;
        config.target = configPara.default.languageTarget;
        storage.set('config', config, (error) => { if (error) throw error });
    }
}
async function setConfig(name, value) {
    let getConfigPromise = new Promise<DefaultConfig>(resolve => {
        storage.get('config', (error, result) => {
            if (error) throw error;
            resolve(result as DefaultConfig);
        })
    });
    let config = await getConfigPromise;
    config[name] = value;
    storage.set('config', config, error => { if (error) throw error });
}
async function getConfig() {
    let getConfigPromise = new Promise<DefaultConfig>(resolve => {
        storage.get('config', (error, result) => {
            if (error) throw error;
            resolve(result as DefaultConfig);
        })
    })
    let config = await getConfigPromise;
    configPara.default.languageSource = config.source;
    configPara.default.languageTarget = config.target;
    return configPara;
}
function getDetail() {
    let detail = configPara.languageDetail.find(element => {
        return element.source == configPara.default.languageSource &&
            element.target == configPara.default.languageTarget;
    });
    return detail;
}
export { setConfig, getConfig, initConfig, getDetail };