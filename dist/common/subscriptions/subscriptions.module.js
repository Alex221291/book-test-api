"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsModule = void 0;
const common_1 = require("@nestjs/common");
const subscriptions_entity_1 = require("./subscriptions.entity");
const subscriptions_plan_entity_1 = require("./subscriptions.plan.entity");
const subscriptions_resolver_1 = require("./subscriptions.resolver");
const subscriptions_plan_resolver_1 = require("./subscriptions.plan.resolver");
const subscriptions_service_1 = require("./subscriptions.service");
const subscriptions_plan_service_1 = require("./subscriptions.plan.service");
const companies_module_1 = require("../companies/companies.module");
const services_module_1 = require("../services/services.module");
const typeorm_1 = require("@nestjs/typeorm");
const customer_module_1 = require("../customers/customer.module");
const bookings_module_1 = require("../bookings/bookings.module");
const payments_module_1 = require("../payments/payments.module");
let SubscriptionsModule = class SubscriptionsModule {
};
SubscriptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            companies_module_1.CompaniesModule,
            (0, common_1.forwardRef)(() => services_module_1.ServicesModule),
            (0, common_1.forwardRef)(() => customer_module_1.CustomerModule),
            payments_module_1.PaymentsModule,
            (0, common_1.forwardRef)(() => bookings_module_1.BookingsModule),
            typeorm_1.TypeOrmModule.forFeature([subscriptions_plan_entity_1.SubscriptionsPlanEntity, subscriptions_entity_1.SubscriptionsEntity]),
        ],
        providers: [
            subscriptions_resolver_1.SubscriptionsResolver,
            subscriptions_plan_resolver_1.SubscriptionsPlanResolver,
            subscriptions_service_1.SubscriptionsService,
            subscriptions_plan_service_1.SubscriptionsPlanService,
        ],
        exports: [subscriptions_plan_service_1.SubscriptionsPlanService, subscriptions_service_1.SubscriptionsService],
    })
], SubscriptionsModule);
exports.SubscriptionsModule = SubscriptionsModule;
//# sourceMappingURL=subscriptions.module.js.map