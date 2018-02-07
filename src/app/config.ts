import * as storage from 'electron-json-storage';
import { error } from 'util';

const configPara = {
    'default': {
        'source': 'zh',
        'target': 'en',
        'name': 'Longman',
        'value': 'longman',
        'function': 'getLongmanWord',
        'playSound': 'true'
    },
    'playSoundOptions': [
        {
            'name': 'play',
            'value': 'true'
        },
        {
            'name': 'do not play',
            'value': 'false'
        }
    ],
    'languageSource': [
        {
            'name': '中文',
            'value': 'zh'
        },
        {
            'name': '한국어',
            'value': 'ko'
        },
        {
            'name': '日本語',
            'value': 'ja'
        },
        {
            'name': 'Ελληνικά',
            'value': 'el'
        },
        {
            'name': 'Nederlands',
            'value': 'nl'
        },
        {
            'name': 'bahasa Indonesia',
            'value': 'id'
        }
    ],
    'languageTarget': [
        {
            'name': 'English',
            'value': 'en'
        }
    ],
    'languageDetail': [
        {
            'source': 'zh',
            'target': 'en',
            'name': 'Longman',
            'value': 'longman',
            'function': 'getLongmanWord'
        }
    ]
};

const configName = 'config2';
async function initConfig() {
    const hasKeyPromise = new Promise<boolean>(resolve => {
        storage.has(configName, (errorMsg, result) => {
            if (errorMsg) { throw errorMsg; }
            resolve(result);
        });
    });
    const hasKey = await hasKeyPromise;
    if (hasKey === false) {
        storage.set(configName, configPara.default, (errorMsg) => { if (errorMsg) { throw errorMsg; } });
    } else {
        await getConfig();
    }
}
async function setConfig(name, value) {
    configPara.default[name] = value;
    storage.set(configName, configPara.default, errorMsg => { if (errorMsg) { throw errorMsg; } });
}
async function getConfig() {
    const getConfigPromise = new Promise<typeof configPara.default>(resolve => {
        storage.get(configName, (errorMsg, result) => {
            if (errorMsg) { throw errorMsg; }
            resolve(result as typeof configPara.default);
        });
    });
    configPara.default = await getConfigPromise;
    return configPara;
}
function getDetail() {
    const detail = configPara.languageDetail.find(element => {
        return element.source === configPara.default.source &&
            element.target === configPara.default.target;
    });
    return detail;
}
export {
    configPara, setConfig, getConfig, initConfig, getDetail
};
