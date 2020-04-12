import Consts from "core/Consts";

export default class LocalizationManager {
    static Translate(key: string, culture: string | null = null, localizations: Record<string, string> | null = null): string {

        if (!culture) {
            culture = Consts.defaultCulture;
        }
        const resources: Record<string, Record<string, string>> = require(`./localizations.json`);

        var result = resources[key] === undefined ? key : resources[key][culture];
        if (localizations) {
            for (let key in localizations) {
                if (result.includes(key)) {
                    result = result.replace(key, localizations[key]);
                }
            }
        }
        return result;
    }
}