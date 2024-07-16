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
var SMSSenderA1Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSSenderA1Service = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let SMSSenderA1Service = SMSSenderA1Service_1 = class SMSSenderA1Service {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(SMSSenderA1Service_1.name);
    }
    async sendSMS(user, apikey, msisdn, text, extra = {}) {
        var _a;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService
                .get('https://smart-sender.a1.by/api/send/sms', {
                params: Object.assign({ user,
                    apikey,
                    msisdn,
                    text }, extra),
            })
                .pipe());
            if (data === null || data === void 0 ? void 0 : data.error) {
                this.logger.warn((_a = data.error) === null || _a === void 0 ? void 0 : _a.description);
            }
        }
        catch (e) {
            this.logger.warn(e.message);
        }
        return true;
    }
};
SMSSenderA1Service = SMSSenderA1Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SMSSenderA1Service);
exports.SMSSenderA1Service = SMSSenderA1Service;
//# sourceMappingURL=sms-sender-a1.service.js.map