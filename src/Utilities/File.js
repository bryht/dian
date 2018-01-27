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
const electron_1 = require("electron");
var Filter;
(function (Filter) {
    Filter["pdf"] = "pdf";
    Filter["txt"] = "txt";
})(Filter = exports.Filter || (exports.Filter = {}));
class File {
    constructor(parameters) {
    }
    static openFile(title, defaultPath, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let fileName = yield new Promise(resolve => {
                electron_1.remote.dialog.showSaveDialog({
                    'title': title,
                    'defaultPath': defaultPath + '-' + Date.now(),
                    'filters': [{ 'name': filter, 'extensions': [filter] }],
                    'buttonLabel': 'Save'
                }, result => {
                    resolve(result);
                });
            });
            if (fileName == undefined) {
                return false;
            }
            return fileName;
        });
    }
}
exports.File = File;
//# sourceMappingURL=File.js.map