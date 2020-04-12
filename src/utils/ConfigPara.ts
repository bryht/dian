const storage = window.require('electron-json-storage');

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

const configName = 'config6';
async function initConfig() {
    const hasKeyPromise = new Promise<boolean>(resolve => {
        storage.has(configName, (errorMsg: any, result: boolean | PromiseLike<boolean> | undefined) => {
            if (errorMsg) { throw errorMsg; }
            resolve(result);
        });
    });
    const hasKey = await hasKeyPromise;
    if (hasKey === false) {
        storage.set(configName, configPara.default, (errorMsg: any) => { if (errorMsg) { throw errorMsg; } });
    }
}
async function setConfig(config: typeof configPara.default) {
    storage.set(configName, configPara.default, (errorMsg: any) => { if (errorMsg) { throw errorMsg; } });
}
async function getConfig() {
    await initConfig();
    const getConfigPromise = new Promise<typeof configPara.default>(resolve => {
        storage.get(configName, (errorMsg: any, result: { source: string; target: string; name: string; value: string; function: string; playSound: string; }) => {
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