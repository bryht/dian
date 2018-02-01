"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage = require("electron-json-storage");
const DefaultConfig_1 = require("./Entities/DefaultConfig");
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
};
function initConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        let hasKeyPromise = new Promise(resolve => {
            storage.has('config', (error, result) => {
                if (error)
                    throw error;
                resolve(result);
            });
        });
        let hasKey = yield hasKeyPromise;
        if (hasKey == false) {
            let config = new DefaultConfig_1.default();
            config.source = configPara.default.languageSource;
            config.target = configPara.default.languageTarget;
            storage.set('config', config, (error) => { if (error)
                throw error; });
        }
    });
}
exports.initConfig = initConfig;
function setConfig(name, value) {
    return __awaiter(this, void 0, void 0, function* () {
        let getConfigPromise = new Promise(resolve => {
            storage.get('config', (error, result) => {
                if (error)
                    throw error;
                resolve(result);
            });
        });
        let config = yield getConfigPromise;
        config[name] = value;
        storage.set('config', config, error => { if (error)
            throw error; });
    });
}
exports.setConfig = setConfig;
function getConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        let getConfigPromise = new Promise(resolve => {
            storage.get('config', (error, result) => {
                if (error)
                    throw error;
                resolve(result);
            });
        });
        let config = yield getConfigPromise;
        configPara.default.languageSource = config.source;
        configPara.default.languageTarget = config.target;
        return configPara;
    });
}
exports.getConfig = getConfig;
function getDetail() {
    let detail = configPara.languageDetail.find(element => {
        return element.source == configPara.default.languageSource &&
            element.target == configPara.default.languageTarget;
    });
    return detail;
}
exports.getDetail = getDetail;
//# sourceMappingURL=config.js.map