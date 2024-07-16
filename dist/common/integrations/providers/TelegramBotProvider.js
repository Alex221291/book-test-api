"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseMessageProvider_1 = require("./BaseMessageProvider");
class TelegramBotProvider extends BaseMessageProvider_1.BaseMessageProvider {
    constructor(notificationService, config) {
        super();
        this.notificationService = notificationService;
        this.templates = {
            draft: '',
            cancelled: '',
        };
        this.setConfig(JSON.parse(config));
    }
    async send() {
        this.notificationService.sendTGMessage(this.token, this.chatId, this.text);
    }
    setBody(text) {
        this.text = text;
    }
    setConfig(params) {
        this.token = params.token;
        this.chatId = params.chatId;
        this.templates = {
            draft: params.draft,
            cancelled: params.cancelled,
        };
    }
}
exports.default = TelegramBotProvider;
//# sourceMappingURL=TelegramBotProvider.js.map