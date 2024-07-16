"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseMessageProvider_1 = require("./BaseMessageProvider");
const common_1 = require("@nestjs/common");
class A1SMSProvider extends BaseMessageProvider_1.BaseMessageProvider {
    constructor(notificationService, config) {
        super();
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(A1SMSProvider.name);
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
        this.logger.log(this.text);
        await this.notificationService.sendSMS(this.phone, this.text, {
            user: this.user,
            apikey: this.apikey,
        });
    }
    setBody(text) {
        this.text = text;
    }
    setRecipient(to) {
        this.phone = to;
    }
    setConfig(params) {
        this.user = params.user;
        this.apikey = params.apikey;
        this.templates = {
            created: params['draft'],
            cancelled: params['cancelled'],
            updated: params['updated'],
            reminder: params['reminder'],
            code: params['code'],
        };
    }
}
exports.default = A1SMSProvider;
//# sourceMappingURL=A1SMSProvider.js.map