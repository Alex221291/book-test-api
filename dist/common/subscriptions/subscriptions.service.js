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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const subscriptions_entity_1 = require("./subscriptions.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscriptions_plan_service_1 = require("./subscriptions.plan.service");
const customer_service_1 = require("../customers/customer.service");
const date_1 = require("../../base/utils/date");
const parsePhoneNumber_1 = require("../../base/utils/parsePhoneNumber");
const bookings_entity_1 = require("../bookings/bookings.entity");
const luxon_1 = require("luxon");
const payments_event_1 = require("../payments/payments.event");
const payments_service_1 = require("../payments/payments.service");
let SubscriptionsService = class SubscriptionsService extends base_service_1.BaseService {
    constructor(repository, subscriptionPlanService, customerService, paymentsService) {
        super();
        this.repository = repository;
        this.subscriptionPlanService = subscriptionPlanService;
        this.customerService = customerService;
        this.paymentsService = paymentsService;
    }
    async prepareEntity(payload, entity, company, user) {
        const plan = await this.subscriptionPlanService.findOneBy({
            id: payload.plan,
            company: {
                hash: company.hash,
                users: {
                    id: user.id,
                },
            },
        });
        const customer = await this.customerService.findOneBy({
            id: payload.customer,
            company: {
                users: {
                    id: user.id,
                },
            },
        });
        if (plan && customer) {
            entity.sinceDate = (0, date_1.default)(payload.sinceDate).startOf('day').toJSDate();
            if (payload.untilDate) {
                entity.untilDate = (0, date_1.default)(payload.untilDate).endOf('day').toJSDate();
            }
            else {
                entity.untilDate = (0, date_1.default)(payload.sinceDate)
                    .plus({
                    [plan.unit]: plan.validity,
                })
                    .minus({ day: 1 })
                    .endOf('day')
                    .toJSDate();
            }
            entity.plan = plan;
            entity.customer = customer;
            entity.payment = await this.paymentsService.preparePayment({
                type: 'incoming',
                account_key: 'cash',
                purpose: payments_event_1.PaymentsEvent.SUBSCRIPTION_SALE,
                userId: user.id,
                amount: entity.plan.price,
            }, entity.plan.currency);
        }
        return entity;
    }
    findSubscriptionsByServicesIds(companyId, serviceIds, customerPhone, userId) {
        const builder = this.repository.createQueryBuilder('e');
        builder
            .leftJoinAndSelect('e.plan', 'plan')
            .leftJoinAndSelect('e.bookings', 'bookings')
            .leftJoinAndSelect('plan.services', 'services')
            .leftJoinAndSelect('e.customer', 'customer')
            .leftJoinAndSelect(`customer.company`, 'company')
            .leftJoinAndSelect('company.users', 'users');
        builder
            .andWhere((qb) => {
            const subQuery = qb
                .subQuery()
                .select('COUNT(*)')
                .from(bookings_entity_1.BookingEntity, 'booking')
                .where('booking.subscription = e.id');
            return `plan.visits > ${subQuery.getQuery()}`;
        })
            .andWhere(`e.sinceDate <= :date AND :date <= e.untilDate`, {
            date: luxon_1.DateTime.now().toUTC().toISO(),
        })
            .andWhere(`customer.phone = ${(0, parsePhoneNumber_1.default)(customerPhone)}`)
            .andWhere(`company.hash = '${companyId}'`)
            .andWhere(`users.id IN (${userId})`)
            .andWhere(`services.id IN (${serviceIds.join(',')})`);
        return builder.getMany();
    }
};
SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriptions_entity_1.SubscriptionsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        subscriptions_plan_service_1.SubscriptionsPlanService,
        customer_service_1.CustomerService,
        payments_service_1.PaymentsService])
], SubscriptionsService);
exports.SubscriptionsService = SubscriptionsService;
//# sourceMappingURL=subscriptions.service.js.map