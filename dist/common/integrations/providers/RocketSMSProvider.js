"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("process");
const BaseMessageProvider_1 = require("./BaseMessageProvider");
class RocketSMSProvider extends BaseMessageProvider_1.BaseMessageProvider {
    constructor(notificationService, config) {
        super();
        this.notificationService = notificationService;
        this.templates = {
            code: '',
            created: '',
            cancelled: '',
            updated: '',
            reminder: '',
        };
        this.setConfig(JSON.parse(config));
    }
    async send() {
        await this.notificationService.sendSMS(this.phone, this.text, {
            username: this.username,
            password: this.password,
        });
    }
    setBody(text) {
        this.text = text;
    }
    setRecipient(to) {
        this.phone = to;
    }
    setConfig(params) {
        this.username = (params === null || params === void 0 ? void 0 : params.username) || process.env.ROCKET_SMS_USERNAME;
        this.password = (params === null || params === void 0 ? void 0 : params.password) || process.env.ROCKET_SMS_PASSWORD;
        this.templates = {
            created: params['draft'],
            cancelled: params['cancelled'],
            updated: params['updated'],
            reminder: params['reminder'],
            code: params['code'],
        };
    }
}
exports.default = RocketSMSProvider;
//# sourceMappingURL=RocketSMSProvider.js.map