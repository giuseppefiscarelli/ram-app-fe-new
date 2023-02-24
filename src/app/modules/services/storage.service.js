"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var core_1 = require("@angular/core");
var app_constants_1 = require("@app/app.constants");
var StorageService = /** @class */ (function () {
    function StorageService() {
        this.storage = localStorage;
        this.change = new rxjs_1.Subject();
        this.add = new rxjs_1.Subject();
        this.remove = new rxjs_1.Subject();
    }
    /**
     * Returns all keys present in localstorage
     * @returns {string[]}
     */
    StorageService.prototype.keys = function (prefix) {
        var keys = [];
        var matchPrefix = prefix ? app_constants_1.StorageKeys.STORAGE_PREFIX + "." + prefix : app_constants_1.StorageKeys.STORAGE_PREFIX;
        for (var key in this.storage) {
            if (this.storage.hasOwnProperty(key) && key.startsWith(matchPrefix)) {
                keys.push(this.extractKey(key));
            }
        }
        return keys;
    };
    /**
     * Returns the related value if the given key exists
     * @param {string} key
     * @returns {any}
     */
    StorageService.prototype.get = function (key) {
        return this.extract(this.storage.getItem(this.buildKey(key)));
    };
    /**
     * Sets a value for a specific key. Note that if the value exists yet, it wil be replaced and the subject 'change' will be triggered.
     * The value will be added otherwise and the 'add' subject will be triggered.
     * @param {string} key
     * @param value
     * @returns {boolean}
     */
    StorageService.prototype.set = function (key, value) {
        var completeKey = this.buildKey(key);
        var oldValue = this.extract(this.storage.getItem(completeKey));
        this.storage.setItem(completeKey, this.prepareForSave(value));
        if (!oldValue) {
            this.add.next({
                key: key,
                value: value
            });
        }
        else {
            this.change.next({
                key: key,
                oldValue: oldValue,
                newValue: value
            });
        }
        return true;
    };
    /**
     * Removes a specific key form localstorage
     * @param {string} key
     * @returns {boolean} 'true' if the deletion was completed succesfully, 'false' otherwise (maybe the key doesn't exists)
     */
    StorageService.prototype.unset = function (key) {
        var result = false;
        var completeKey = this.buildKey(key);
        var oldValue = this.storage.getItem(completeKey);
        if (oldValue) {
            result = true;
            this.storage.removeItem(completeKey);
            this.remove.next({
                key: key,
                oldValue: oldValue
            });
        }
        return result;
    };
    StorageService.prototype.buildKey = function (key) {
        return app_constants_1.StorageKeys.STORAGE_PREFIX + "." + key;
    };
    StorageService.prototype.extractKey = function (key) {
        var prefixLength = app_constants_1.StorageKeys.STORAGE_PREFIX.length;
        return key.substr(prefixLength + 1, key.length - prefixLength);
    };
    StorageService.prototype.prepareForSave = function (value) {
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return (!!value) ? value.toString() : null;
    };
    StorageService.prototype.extract = function (value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    };
    StorageService.apiName = 'StorageService';
    StorageService = __decorate([
        core_1.Injectable()
    ], StorageService);
    return StorageService;
}());
exports.StorageService = StorageService;
