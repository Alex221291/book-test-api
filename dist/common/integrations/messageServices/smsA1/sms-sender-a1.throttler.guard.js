"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSSenderA1ThrottlerGuard = void 0;
const throttler_1 = require("@nestjs/throttler");
const common_1 = require("@nestjs/common");
let SMSSenderA1ThrottlerGuard = class SMSSenderA1ThrottlerGuard extends throttler_1.ThrottlerGuard {
    async handleRequest(context, limit, ttl) {
        const connection = context.switchToRpc();
        const { phone } = connection.getData();
        if (phone) {
            const key = this.generateKey(context, phone);
            const { totalHits } = await this.storageService.increment(key, ttl);
            if (totalHits > limit) {
                const context = connection.getContext();
                context.delay = ttl;
            }
        }
        return true;
    }
};
SMSSenderA1ThrottlerGuard = __decorate([
    (0, common_1.Injectable)()
], SMSSenderA1ThrottlerGuard);
exports.SMSSenderA1ThrottlerGuard = SMSSenderA1ThrottlerGuard;
//# sourceMappingURL=sms-sender-a1.throttler.guard.js.map