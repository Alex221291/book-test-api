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
exports.SubscriptionsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const subscriptions_entity_1 = require("./subscriptions.entity");
const subscriptions_service_1 = require("./subscriptions.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const subscriptions_input_1 = require("./subscriptions.input");
const companies_service_1 = require("../companies/companies.service");
const rxjs_1 = require("rxjs");
const subscriptions_plan_service_1 = require("./subscriptions.plan.service");
const customer_service_1 = require("../customers/customer.service");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const subscriptions_paginate_1 = require("./types/subscriptions.paginate");
const bookings_service_1 = require("../bookings/bookings.service");
const auth_plans_guard_1 = require("../../auth/auth.plans.guard");
const auth_plans_decorator_1 = require("../../auth/auth.plans.decorator");
const users_plan_enum_1 = require("../users/users.plan.enum");
let SubscriptionsResolver = class SubscriptionsResolver {
    constructor(subscriptionsService, companiesService, subscriptionPlanService, customerService, bookingsService) {
        this.subscriptionsService = subscriptionsService;
        this.companiesService = companiesService;
        this.subscriptionPlanService = subscriptionPlanService;
        this.customerService = customerService;
        this.bookingsService = bookingsService;
    }
    async addSubscription(user, companyId, payload) {
        const company = await this.companiesService.getCompanyByUser(companyId, user);
        if (company) {
            const entity = new subscriptions_entity_1.SubscriptionsEntity();
            return await this.subscriptionsService.add(await this.subscriptionsService.prepareEntity(payload, entity, company, user));
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async updateSubscription(user, companyId, id, payload) {
        const entity = await this.subscriptionsService.findOneBy({
            id,
            plan: {
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            }
        });
        if (entity) {
            return await this.subscriptionsService.update(await this.subscriptionsService.prepareEntity(payload, entity, entity.plan.company, user));
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async getSubscriptions(user, companyId, filters, sorters, offset, limit) {
        const builder = this.subscriptionsService.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.bookings', 'bookings')
            .leftJoinAndSelect('e.plan', 'plan')
            .leftJoinAndSelect('plan.services', 'services')
            .leftJoinAndSelect('e.customer', 'customer')
            .leftJoinAndSelect('customer.company', 'company')
            .leftJoinAndSelect('company.users', 'users')
            .andWhere(`users.id IN(${user.id})`)
            .andWhere(`company.hash = '${companyId}'`);
        const [data, count] = await builder.getManyAndCount();
        return new subscriptions_paginate_1.default(data, count, offset, limit);
    }
    async getSubscriptionsByOrderId(user, companyId, orderId, customerPhone) {
        var _a;
        const order = await this.bookingsService.findOneBy({
            id: orderId,
            office: {
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            },
        }, {
            schedules: true,
        });
        if (order) {
            const serviceIds = (_a = order.schedules) === null || _a === void 0 ? void 0 : _a.map((item) => item.services.map((el) => el.id)).flat(1);
            return await this.subscriptionsService.findSubscriptionsByServicesIds(companyId, serviceIds, customerPhone, user.id);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async getSubscription(user, companyId, id) {
        return await this.subscriptionsService.findOneBy({
            id: id,
            plan: {
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            }
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => subscriptions_entity_1.SubscriptionsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, subscriptions_input_1.SubscriptionsInput]),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "addSubscription", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => subscriptions_entity_1.SubscriptionsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(3, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number, subscriptions_input_1.SubscriptionsInput]),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Query)(() => subscriptions_paginate_1.default),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('filters', {
        nullable: true,
        defaultValue: [{ operator: 'AND', filters: [] }],
        type: () => [filters_type_1.default],
    })),
    __param(3, (0, graphql_1.Args)('sorters', { nullable: true, type: () => [sorter_type_1.default] })),
    __param(4, (0, graphql_1.Args)('offset', { type: () => graphql_1.Int, nullable: true })),
    __param(5, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Array, Array, Number, Number]),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "getSubscriptions", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Query)(() => [subscriptions_entity_1.SubscriptionsEntity]),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('orderId', { type: () => graphql_1.Int })),
    __param(3, (0, graphql_1.Args)('customerPhone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number, String]),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "getSubscriptionsByOrderId", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Query)(() => subscriptions_entity_1.SubscriptionsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number]),
    __metadata("design:returntype", Promise)
], SubscriptionsResolver.prototype, "getSubscription", null);
SubscriptionsResolver = __decorate([
    (0, graphql_1.Resolver)(() => subscriptions_entity_1.SubscriptionsEntity),
    (0, auth_plans_decorator_1.Plans)(users_plan_enum_1.PlanTypes.MEDIUM, users_plan_enum_1.PlanTypes.PRO),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService,
        companies_service_1.CompaniesService,
        subscriptions_plan_service_1.SubscriptionsPlanService,
        customer_service_1.CustomerService,
        bookings_service_1.BookingsService])
], SubscriptionsResolver);
exports.SubscriptionsResolver = SubscriptionsResolver;
//# sourceMappingURL=subscriptions.resolver.js.map