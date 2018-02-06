webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var basic_component_1 = __webpack_require__("./src/app/basic/basic.component.ts");
__webpack_require__("./node_modules/bootstrap/dist/js/bootstrap.js");
var setting_component_1 = __webpack_require__("./src/app/setting/setting.component.ts");
var serach_word_component_1 = __webpack_require__("./src/app/serach-word/serach-word.component.ts");
var word_service_1 = __webpack_require__("./src/app/word.service.ts");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                basic_component_1.BasicComponent,
                setting_component_1.SettingComponent,
                serach_word_component_1.SerachWordComponent
            ],
            schemas: [core_1.NO_ERRORS_SCHEMA],
            imports: [
                platform_browser_1.BrowserModule, forms_1.FormsModule
            ],
            providers: [
                word_service_1.WordService
            ],
            bootstrap: [basic_component_1.BasicComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ }),

/***/ "./src/app/basic/basic.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/basic/basic.component.html":
/***/ (function(module, exports) {

module.exports = "<!-- Alert -->\n<div id=\"infoAlert\" class=\"alert alert-warning alert-dismissible d-none\" role=\"alert\">\n  <strong>Info!</strong>\n  <span id=\"messages\">You have new update downloaded, do you want to update?</span>\n  <button type=\"button\" class=\"btn-primary\" (click)=\"update()\">Update</button>\n  <button type=\"button\" class=\"btn-warning\" data-dismiss=\"alert\" aria-label=\"Close\">\n    Later\n  </button>\n</div>\n<!-- Modal -->\n<div class=\"modal fade\" id=\"settingModal\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-body\">\n        <h2>Setting</h2>\n        <hr>\n        <div class=\"form-group\">\n          <label>Language you know:</label>\n          <select [(ngModel)]=\"sourceCurrent\" class=\"form-control\">\n            <option *ngFor=\"let element of sourceList\" [value]=\"element.value\">{{element.name}}</option>\n          </select>\n        </div>\n        <div class=\"form-group\">\n          <label>Language you learn:</label>\n          <select [(ngModel)]=\"targetCurrent\" class=\"form-control\">\n            <option *ngFor=\"let element of targetList\" [value]=\"element.value\">{{element.name}}</option>\n          </select>\n        </div>\n        <div class=\"form-group\">\n          <label>Auto play word Sound?</label>\n          <select [(ngModel)]=\"soundCurrent\" class=\"form-control\">\n            <option *ngFor=\"let element of soundList\" [value]=\"element.value\">{{element.name}}</option>\n          </select>\n        </div>\n        <div class=\"d-flex justify-content-end\">\n          <button class=\"btn btn-success m-1\" (click)=\"settingSave()\" data-dismiss=\"modal\">Save</button>\n          <button class=\"btn btn-danger m-1\" data-dismiss=\"modal\">Cancle</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"container\">\n  <div class=\"row\">\n    <div id=\"content\" class=\"col\">\n      <app-serach-word></app-serach-word>\n    </div>\n    <div class=\"wrapper\">\n      <div id=\"settingPanel\" class=\"collapse navbar-collapse sticky-top mt-2\">\n        <app-setting></app-setting>\n      </div>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/basic/basic.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var electron_1 = __webpack_require__("electron");
var Mousetrap = __webpack_require__("./node_modules/mousetrap/mousetrap.js");
var config_1 = __webpack_require__("./src/app/config.ts");
var electron_2 = __webpack_require__("electron");
var BasicComponent = /** @class */ (function () {
    function BasicComponent() {
    }
    BasicComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, config_1.initConfig()];
                    case 1:
                        _a.sent();
                        this.sourceList = config_1.configPara.languageSource;
                        this.sourceCurrent = config_1.configPara.default.source;
                        this.targetList = config_1.configPara.languageTarget;
                        this.targetCurrent = config_1.configPara.default.target;
                        this.soundList = config_1.configPara.playSoundOptions;
                        this.soundCurrent = config_1.configPara.default.playSound;
                        Mousetrap.bind('esc', function () { _this.miniMize(); });
                        electron_2.ipcRenderer.on('message', function (event, text) {
                            if (text === 'downloaded') {
                                document.querySelector('#infoAlert').classList.remove('d-none');
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    BasicComponent.prototype.update = function () {
        electron_2.ipcRenderer.send('message', 'update');
    };
    BasicComponent.prototype.miniMize = function () {
        electron_1.remote.BrowserWindow.getFocusedWindow().minimize();
    };
    BasicComponent.prototype.settingSave = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, config_1.setConfig('source', this.sourceCurrent)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, config_1.setConfig('target', this.targetCurrent)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, config_1.setConfig('playSound', this.soundCurrent)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BasicComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            template: __webpack_require__("./src/app/basic/basic.component.html"),
            styles: [__webpack_require__("./src/app/basic/basic.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], BasicComponent);
    return BasicComponent;
}());
exports.BasicComponent = BasicComponent;


/***/ }),

/***/ "./src/app/config.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var storage = __webpack_require__("./node_modules/electron-json-storage/lib/storage.js");
var configPara = {
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
exports.configPara = configPara;
var configName = 'config2';
function initConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var hasKeyPromise, hasKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hasKeyPromise = new Promise(function (resolve) {
                        storage.has(configName, function (errorMsg, result) {
                            if (errorMsg) {
                                throw errorMsg;
                            }
                            resolve(result);
                        });
                    });
                    return [4 /*yield*/, hasKeyPromise];
                case 1:
                    hasKey = _a.sent();
                    if (!(hasKey === false)) return [3 /*break*/, 2];
                    storage.set(configName, configPara.default, function (errorMsg) { if (errorMsg) {
                        throw errorMsg;
                    } });
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getConfig()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.initConfig = initConfig;
function setConfig(name, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            configPara.default[name] = value;
            storage.set(configName, configPara.default, function (errorMsg) { if (errorMsg) {
                throw errorMsg;
            } });
            return [2 /*return*/];
        });
    });
}
exports.setConfig = setConfig;
function getConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var getConfigPromise, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    getConfigPromise = new Promise(function (resolve) {
                        storage.get(configName, function (errorMsg, result) {
                            if (errorMsg) {
                                throw errorMsg;
                            }
                            resolve(result);
                        });
                    });
                    _a = configPara;
                    return [4 /*yield*/, getConfigPromise];
                case 1:
                    _a.default = _b.sent();
                    return [2 /*return*/, configPara];
            }
        });
    });
}
exports.getConfig = getConfig;
function getDetail() {
    var detail = configPara.languageDetail.find(function (element) {
        return element.source === configPara.default.source &&
            element.target === configPara.default.target;
    });
    return detail;
}
exports.getDetail = getDetail;


/***/ }),

/***/ "./src/app/file.utility.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __webpack_require__("electron");
var Filter;
(function (Filter) {
    Filter["pdf"] = "pdf";
    Filter["txt"] = "txt";
})(Filter = exports.Filter || (exports.Filter = {}));
var File = /** @class */ (function () {
    function File(parameters) {
    }
    File.openFile = function (title, defaultPath, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var fileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) {
                            electron_1.remote.dialog.showSaveDialog({
                                'title': title,
                                'defaultPath': defaultPath + '-' + Date.now(),
                                'filters': [{ 'name': filter, 'extensions': [filter] }],
                                'buttonLabel': 'Save'
                            }, function (result) {
                                resolve(result);
                            });
                        })];
                    case 1:
                        fileName = _a.sent();
                        if (fileName === undefined) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, fileName];
                }
            });
        });
    };
    return File;
}());
exports.File = File;


/***/ }),

/***/ "./src/app/serach-word/serach-word.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/* The animation code */\r\n@-webkit-keyframes fly-left {\r\n    from {left: 0;}\r\n    to {left: -100%;}\r\n}\r\n@keyframes fly-left {\r\n    from {left: 0;}\r\n    to {left: -100%;}\r\n}\r\n/* The element to apply the animation to */\r\n.word-delete {\r\n    -webkit-animation-name: fly-left;\r\n            animation-name: fly-left;\r\n    -webkit-animation-duration: 0.6s;\r\n            animation-duration: 0.6s;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/serach-word/serach-word.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"input-group sticky-top mt-2\">\n    <input type=\"text\" id=\"word\" #wordInput class=\"form-control\" (keyup.esc)=\"wordInput.blur()\" (keydown.enter)=\"searchWord(wordInput.value,$event)\" placeholder=\"Command/Ctrl+F\">\n    <div class=\"input-group-append\">\n        <button class=\"btn btn-secondary\" type=\"button\" (click)=\"searchWord(wordInput.value,$event)\">Search</button>\n        <button class=\"btn btn-secondary active\" type=\"button\" data-toggle=\"collapse\" data-target=\"#settingPanel\">\n            <img src=\"{{settingImage}}\" alt=\"Setting\">\n        </button>\n    </div>\n</div>\n<div id=\"wordHistory\" class=\"mt-2\">\n    <div class=\"card\" *ngFor=\"let element of words\" id=\"card{{element.id}}\">\n        <div class=\"card-header alert alert-{{element.isPhrase ? 'success' : 'primary'}}\" role=\"tab\" id=\"heading{{element.id}}\">\n            <a [innerHTML]=\"element.word+(element.isPhrase?'<br>':':')+element.translation\">\n            </a>\n            <a class=\"badge badge-pill badge-danger float-right text-light ml-1\" (click)=\"deleteWord(element.id)\">Delete</a>\n            <a data-toggle=\"collapse\" (click)=\"showWord(element.id,element.url)\" href=\"#collapse{{element.id}}\" attr.aria-controls=\"collapse{{element.id}}\"\n                aria-expanded=\"false\" class=\"{{element.hasContent ? 'visible' : 'invisible'}} badge badge-info float-right ml-1\">See more</a>\n            <a class=\"{{(element.sign == undefined || element.sign == '') ? 'invisible' : 'visible'}} badge badge-pill badge-warning float-right ml-1\">{{element.sign}}</a>\n        </div>\n        <div id=\"collapse{{element.id}}\" class=\"collapse\" aria-labelledby=\"heading{{element.id}}\" data-parent=\"#wordHistory\">\n            <div class=\"card-body\" style=\"overflow:hidden\">\n                <webview id=\"web{{element.id}}\" autosize=\"on\" style=\"margin-top:-250px;height:600px;display:flex;\"></webview>\n            </div>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/serach-word/serach-word.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var word_service_1 = __webpack_require__("./src/app/word.service.ts");
var Mousetrap = __webpack_require__("./node_modules/mousetrap/mousetrap.js");
var config_1 = __webpack_require__("./src/app/config.ts");
var SerachWordComponent = /** @class */ (function () {
    function SerachWordComponent(wordService) {
        this.wordService = wordService;
        this.settingImage = __webpack_require__("./src/assets/settings.svg");
    }
    SerachWordComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.getWords();
                window.onfocus = function () {
                    var word = document.querySelector('#word');
                    word.focus();
                    word.value = '';
                };
                Mousetrap.bind(['command+f', 'ctrl+f'], function () {
                    var word = document.querySelector('#word');
                    word.focus();
                    word.value = '';
                });
                Mousetrap.bind('j', function () {
                    var webView = document.querySelector('div.collapse.show div webview');
                    if (webView != null) {
                        webView.executeJavaScript('document.querySelector("body").scrollTop+=20', false);
                    }
                });
                Mousetrap.bind('k', function () {
                    var webView = document.querySelector('div.collapse.show div webview');
                    if (webView != null) {
                        webView.executeJavaScript('document.querySelector("body").scrollTop-=20', false);
                    }
                });
                Mousetrap.bind('J', function () {
                    window.scrollTo(window.scrollX, window.scrollY + 20);
                });
                Mousetrap.bind('K', function () {
                    window.scrollTo(window.scrollX, window.scrollY - 20);
                });
                return [2 /*return*/];
            });
        });
    };
    SerachWordComponent.prototype.getWords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.wordService.getAllWords()];
                    case 1:
                        _a.words = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SerachWordComponent.prototype.deleteWord = function (id) {
        var _this = this;
        var card = document.querySelector('#card' + id);
        card.addEventListener('animationend', function (e) {
            _this.wordService.deleteWord(id, _this.words);
            _this.wordService.updateWords(_this.words);
        });
        card.classList.add('word-delete');
    };
    SerachWordComponent.prototype.showWord = function (id, url) {
        document.getElementById('web' + id).setAttribute('src', url);
    };
    SerachWordComponent.prototype.searchWord = function (value, event) {
        return __awaiter(this, void 0, void 0, function () {
            var inputWord, word, showList, index, element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWord = value.trim();
                        return [4 /*yield*/, this.wordService.getLongmanWord(inputWord)];
                    case 1:
                        word = _a.sent();
                        if (word.soundUrl && config_1.configPara.default.playSound === 'true') {
                            this.wordService.playSound(word.soundUrl);
                        }
                        word = this.wordService.insertWord(word, this.words);
                        return [4 /*yield*/, this.wordService.updateWords(this.words)];
                    case 2:
                        _a.sent();
                        if (word.isPhrase === false) {
                            // document.querySelector('#web' + word.id).setAttribute('src', word.url);
                            document.getElementById('web' + word.id).setAttribute('src', word.url);
                            showList = document.querySelectorAll('.show');
                            for (index = 0; index < showList.length; index++) {
                                element = showList[index];
                                element.classList.remove('show');
                            }
                            document.querySelector('#collapse' + word.id).classList.add('show');
                        }
                        event.target.blur();
                        return [2 /*return*/];
                }
            });
        });
    };
    SerachWordComponent = __decorate([
        core_1.Component({
            selector: 'app-serach-word',
            template: __webpack_require__("./src/app/serach-word/serach-word.component.html"),
            styles: [__webpack_require__("./src/app/serach-word/serach-word.component.css")]
        }),
        __metadata("design:paramtypes", [word_service_1.WordService])
    ], SerachWordComponent);
    return SerachWordComponent;
}());
exports.SerachWordComponent = SerachWordComponent;


/***/ }),

/***/ "./src/app/setting/setting.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/setting/setting.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"btn-group-vertical\">\n  <div class=\"btn-group\" role=\"group\">\n    <button type=\"button\" class=\"btn btn-danger dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n      Delete\n    </button>\n    <div class=\"dropdown-menu\">\n      <button type=\"button\" (click)=\"deleteAllHistory()\" class=\"dropdown-item\">\n        All History\n      </button>\n    </div>\n  </div>\n  <div class=\"btn-group\" role=\"group\">\n    <button type=\"button\" class=\"btn btn-success dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n      Export\n    </button>\n    <div class=\"dropdown-menu\">\n      <button type=\"button\" (click)=\"exportMutiChoiceTest()\" class=\"dropdown-item\">\n      MutiChoice Test\n      </button>\n      <button type=\"button\" (click)=\"exportBlankTest()\" class=\"dropdown-item\">\n        Blank Test\n      </button>\n      <button type=\"button\" (click)=\"exportWords()\" class=\"dropdown-item\">\n        To Memrise\n      </button>\n      <button type=\"button\" (click)=\"exportWords('momo')\" class=\"dropdown-item\">\n        To Momo\n      </button>\n    </div>\n  </div>\n  <button type=\"button\" class=\"btn btn-secondary\" data-toggle=\"modal\" data-target=\"#settingModal\">\n    Setting\n  </button>\n  <button (click)=\"openLink()\" type=\"button\" class=\"btn btn-warning\">\n    How To Use\n  </button>\n</div>"

/***/ }),

/***/ "./src/app/setting/setting.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var electron_1 = __webpack_require__("electron");
var fs = __webpack_require__("./node_modules/fs-extra/lib/index.js");
var https = __webpack_require__("https");
var file_utility_1 = __webpack_require__("./src/app/file.utility.ts");
var word_service_1 = __webpack_require__("./src/app/word.service.ts");
var SettingComponent = /** @class */ (function () {
    function SettingComponent(wordService) {
        this.wordService = wordService;
    }
    SettingComponent.prototype.ngOnInit = function () {
    };
    SettingComponent.prototype.openLink = function () {
        var url = 'https://bryht.gitbooks.io/dict/how-to-use.html';
        electron_1.shell.openExternal(url);
    };
    SettingComponent.prototype.saveMp3File = function (url, fileName) {
        return new Promise(function (resolve, reject) {
            var file = fs.createWriteStream(fileName, { autoClose: true });
            var request = https.get(url, function (res) {
                res.pipe(file);
            });
            request.on('error', function (error) {
                console.log(error);
                reject(error);
            });
            request.on('finish', function () {
                resolve('ok');
            });
        });
    };
    SettingComponent.prototype.exportBlankTest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var words;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wordService.getAllWords()];
                    case 1:
                        words = _a.sent();
                        electron_1.ipcRenderer.send('message', 'exportBlankTest', words);
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingComponent.prototype.exportMutiChoiceTest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var words;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wordService.getAllWords()];
                    case 1:
                        words = _a.sent();
                        electron_1.ipcRenderer.send('message', 'exportMutiChoiceTest', words);
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingComponent.prototype.deleteAllHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ok;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wordService.deleteAllWords()];
                    case 1:
                        ok = _a.sent();
                        if (ok === 'ok') {
                            window.location.reload();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingComponent.prototype.exportWords = function (target) {
        if (target === void 0) { target = 'memrise'; }
        return __awaiter(this, void 0, void 0, function () {
            var fileName, words, _a, folderName, checkFolder, index, element, line, message, index, element, messageMomo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, file_utility_1.File.openFile('SaveWords', 'WordList', file_utility_1.Filter.txt)];
                    case 1:
                        fileName = _b.sent();
                        if (fileName === false) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.wordService.getAllWords()];
                    case 2:
                        words = _b.sent();
                        _a = target;
                        switch (_a) {
                            case 'memrise': return [3 /*break*/, 3];
                            case 'momo': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 10];
                    case 3:
                        folderName = fileName.split('.')[0] + 'audio';
                        return [4 /*yield*/, fs.ensureDir(folderName)];
                    case 4:
                        checkFolder = _b.sent();
                        index = 0;
                        _b.label = 5;
                    case 5:
                        if (!(index < words.length)) return [3 /*break*/, 8];
                        element = words[index];
                        if (element.hasContent === false || element.isPhrase) {
                            return [3 /*break*/, 7];
                        }
                        line = element.word + "," + element.type + "," + element.define + ",\n          [" + element.translation + "]" + element.pronunciation + "," + element.example;
                        fs.appendFileSync(fileName, line + '\r\n');
                        return [4 /*yield*/, this.saveMp3File(element.soundUrl, folderName + '\\' + element.word + '.mp3')];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        index++;
                        return [3 /*break*/, 5];
                    case 8:
                        message = 'Words have saved in ' + fileName + '\n\t Audios have saved in ' + folderName;
                        alert(message);
                        return [3 /*break*/, 10];
                    case 9:
                        for (index = 0; index < words.length; index++) {
                            element = words[index];
                            if (element.hasContent === false || element.isPhrase) {
                                continue;
                            }
                            fs.appendFileSync(fileName, element.word + '\r\n');
                        }
                        messageMomo = 'Words have saved in ' + fileName;
                        alert(messageMomo);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SettingComponent = __decorate([
        core_1.Component({
            selector: 'app-setting',
            template: __webpack_require__("./src/app/setting/setting.component.html"),
            styles: [__webpack_require__("./src/app/setting/setting.component.css")]
        }),
        __metadata("design:paramtypes", [word_service_1.WordService])
    ], SettingComponent);
    return SettingComponent;
}());
exports.SettingComponent = SettingComponent;


/***/ }),

/***/ "./src/app/word.model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Word = /** @class */ (function () {
    function Word() {
    }
    return Word;
}());
exports.default = Word;


/***/ }),

/***/ "./src/app/word.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var https = __webpack_require__("https");
var storage = __webpack_require__("./node_modules/electron-json-storage/lib/storage.js");
var cheerio = __webpack_require__("./node_modules/cheerio/index.js");
var word_model_1 = __webpack_require__("./src/app/word.model.ts");
var guesslanguage_1 = __webpack_require__("./node_modules/guesslanguage/lib/guessLanguage.js");
var translate = __webpack_require__("./node_modules/node-google-translate-skidz/lib/translate.js");
var config_1 = __webpack_require__("./src/app/config.ts");
var util_1 = __webpack_require__("util");
var WordService = /** @class */ (function () {
    function WordService() {
    }
    WordService.prototype.getAllWords = function () {
        var words = new Promise(function (resolve, reject) {
            storage.get('words', function (error, data) {
                if (error) {
                    reject(error);
                }
                if (util_1.isArray(data)) {
                    resolve(data);
                }
                else {
                    resolve(new Array());
                }
            });
        });
        return words;
    };
    WordService.prototype.getLanguage = function (text) {
        return new Promise(function (resolve, reject) {
            var lang = guesslanguage_1.guessLanguage.detect(text, function (result) {
                if (result === 'unknown') {
                    result = 'en';
                }
                resolve(result);
            });
        });
    };
    WordService.prototype.translateWord = function (inputLanguage, inputWord) {
        var isTarget = inputLanguage === config_1.configPara.default.target;
        return new Promise(function (resolve, reject) {
            translate({
                text: inputWord,
                source: isTarget ? config_1.configPara.default.target : config_1.configPara.default.source,
                target: isTarget ? config_1.configPara.default.source : config_1.configPara.default.target,
            }, function (params) {
                var result = new word_model_1.default();
                result.word = (isTarget ? inputWord : params.translation).toLowerCase();
                result.translation = isTarget ? params.translation : inputWord;
                result.isPhrase = result.word.indexOf(' ') > 0;
                resolve(result);
            });
        });
    };
    WordService.prototype.getLongmanWord = function (inputWord) {
        return __awaiter(this, void 0, void 0, function () {
            var inputLanguage, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLanguage(inputWord)];
                    case 1:
                        inputLanguage = _a.sent();
                        return [4 /*yield*/, this.translateWord(inputLanguage, inputWord)];
                    case 2:
                        result = _a.sent();
                        // get the define
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                if (result.isPhrase) {
                                    resolve(result);
                                }
                                var options = {
                                    'method': 'GET',
                                    'hostname': 'www.ldoceonline.com',
                                    'path': '/dictionary/' + result.word
                                };
                                var req = https.request(options, function (res) {
                                    var chunks = [];
                                    res.on('data', function (chunk) {
                                        chunks.push(chunk);
                                    });
                                    res.on('end', function () {
                                        var body = Buffer.concat(chunks);
                                        var $body = cheerio.load(body.toString());
                                        var $content = $body('.entry_content');
                                        var pos = '[' + $body('.POS').first().text().trim() + ']'; // none. verb.
                                        var pronunciation = '[' + $body('.PRON').first().text().replace(/,/g, '-').trim() + ']';
                                        var define = $body('#' + result.word + '__1 .DEF').text().replace(/,/g, '.');
                                        var mp3Url = 'https://www.ldoceonline.com/' + $body('.brefile').first().attr('data-src-mp3');
                                        var exp = $body('#' + result.word + '__1 .EXAMPLE').first().text().replace(/,/g, '.').replace(result.word, '[xxx]').trim();
                                        if (exp.length === 0) {
                                            exp = $body('.cexa1g1[info=UK]').first().text().replace(/,/g, '.').replace(result.word, '[xxx]').trim();
                                        }
                                        var sign = $body('.FREQ').text();
                                        result.important = $body('.frequent').html() != null;
                                        result.hasContent = $content.html() != null;
                                        result.html = ''; // result.isInLongmen ? $content.html() : '';
                                        result.url = 'http://' + options.hostname + options.path;
                                        result.soundUrl = mp3Url;
                                        result.dictionary = 'Longman';
                                        result.type = pos;
                                        result.pronunciation = pronunciation;
                                        result.define = define.trim();
                                        result.sign = sign;
                                        result.example = exp.trim();
                                        resolve(result);
                                    });
                                });
                                req.end();
                            })];
                }
            });
        });
    };
    WordService.prototype.playSound = function (mp3Url) {
        var audio = new Audio(mp3Url);
        audio.play().then(function (value) { }).catch(function (error) { return console.log(error); });
    };
    WordService.prototype.updateWords = function (words) {
        var promise = new Promise(function (resolve, reject) {
            storage.set('words', words, function (errorMsg) {
                if (errorMsg) {
                    reject(errorMsg);
                }
                resolve(words);
            });
        });
        return promise;
    };
    WordService.prototype.insertWord = function (word, wordsArray) {
        for (var index = 0; index < wordsArray.length; index++) {
            var element = wordsArray[index];
            if (element.word === word.word) {
                wordsArray.splice(index, 1);
            }
        }
        word.id = Date.now().toString();
        wordsArray.unshift(word);
        return word;
    };
    WordService.prototype.deleteWord = function (id, wordsArray) {
        for (var index = 0; index < wordsArray.length; index++) {
            var element = wordsArray[index];
            if (element.id === id) {
                wordsArray.splice(index, 1);
            }
        }
        return id;
    };
    WordService.prototype.deleteAllWords = function () {
        return new Promise(function (resovle, reject) {
            storage.remove('words', function (errorMsg) {
                if (errorMsg) {
                    throw errorMsg;
                }
                resovle('ok');
            });
        });
    };
    WordService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], WordService);
    return WordService;
}());
exports.WordService = WordService;


/***/ }),

/***/ "./src/assets/settings.svg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "settings.1ce2b1e6ed8a09054816.svg";

/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var platform_browser_dynamic_1 = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
var app_module_1 = __webpack_require__("./src/app/app.module.ts");
var environment_1 = __webpack_require__("./src/environments/environment.ts");
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ }),

/***/ "assert":
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),

/***/ "constants":
/***/ (function(module, exports) {

module.exports = require("constants");

/***/ }),

/***/ "crypto":
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "electron":
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "events":
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "net":
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ "os":
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "punycode":
/***/ (function(module, exports) {

module.exports = require("punycode");

/***/ }),

/***/ "querystring":
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ }),

/***/ "stream":
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/***/ (function(module, exports) {

module.exports = require("string_decoder");

/***/ }),

/***/ "tls":
/***/ (function(module, exports) {

module.exports = require("tls");

/***/ }),

/***/ "url":
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "util":
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map