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
var PaymentsEvent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsEvent = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const payments_service_1 = require("./payments.service");
const plans_services_1 = require("../plans/plans.services");
let PaymentsEvent = PaymentsEvent_1 = class PaymentsEvent {
    constructor(paymentsService, plansService) {
        this.paymentsService = paymentsService;
        this.plansService = plansService;
    }
    async bookingServiceFee(userId) {
        try {
            const plan = await this.plansService.findOneBy({
                users: {
                    id: userId,
                },
            });
            if (plan) {
                const existingPayments = await this.paymentsService.findAllBy({
                    purpose: PaymentsEvent_1.BOOKING_SERVICE_FEE,
                    user: {
                        id: userId,
                    },
                });
                const amount = existingPayments.length > plan.ordersLimit
                    ? plan.superProfit
                    : plan.profit;
                const payment = await this.paymentsService.preparePayment({
                    type: 'outcoming',
                    account_key: 'account',
                    purpose: PaymentsEvent_1.BOOKING_SERVICE_FEE,
                    userId,
                    amount,
                });
                return await this.paymentsService.add(payment);
            }
        }
        catch (e) {
        }
    }
};
PaymentsEvent.BOOKING_SERVICE_FEE = 'booking.service.fee';
PaymentsEvent.CLOSING_BOOKING_PAYMENT = 'booking.closing.payment';
PaymentsEvent.SUBSCRIPTION_SALE = 'subscription.sale';
__decorate([
    (0, event_emitter_1.OnEvent)(PaymentsEvent_1.BOOKING_SERVICE_FEE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentsEvent.prototype, "bookingServiceFee", null);
PaymentsEvent = PaymentsEvent_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        plans_services_1.PlansService])
], PaymentsEvent);
exports.PaymentsEvent = PaymentsEvent;
//# sourceMappingURL=payments.event.js.map