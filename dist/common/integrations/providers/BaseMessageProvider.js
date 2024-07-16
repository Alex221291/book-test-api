"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMessageProvider = void 0;
class BaseMessageProvider {
    constructor() {
        this.templates = {};
    }
    prepareBody(template, keys) {
        return Object.keys(keys).reduce((acc, key) => {
            const value = keys[key];
            return acc.replace(`{{${key}}}`, value);
        }, template);
    }
    send() {
    }
    setBody(text) {
    }
    setConfig(params) {
    }
    setRecipient(to) {
    }
}
exports.BaseMessageProvider = BaseMessageProvider;
//# sourceMappingURL=BaseMessageProvider.js.map