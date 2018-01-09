"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    "default": {
        "languageSoure": "zh",
        "languageTarget": "en",
        "languageDetail": "longmen"
    },
    "languageSouce": [
        {
            "languageName": "English",
            "languageCode": "en"
        },
        {
            "languageName": "中文",
            "languageCode": "zh"
        }
    ],
    "languageTarget": [
        {
            "languageName": "English",
            "languageCode": "en"
        },
        {
            "languageName": "Dutch",
            "languageCode": "du"
        }
    ],
    "languageDetail": [
        {
            "languageSource": "zh",
            "languageTarget": "en",
            "detailDictionaryName": "Longmen",
            "detailDictionarySign": "longmen",
            "detailDictionaryJsFunction": "ShowDetailWithLongmen"
        },
        {
            "languageSource": "zh",
            "languageTarget": "en",
            "detailDictionaryName": "Oxford",
            "detailDictionarySign": "oxford",
            "detailDictionaryJsFunction": "ShowDetailWithOxford"
        }
    ]
};
exports.config = config;
//# sourceMappingURL=config.js.map