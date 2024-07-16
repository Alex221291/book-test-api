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
exports.SubscriptionsPlanResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const subscriptions_plan_entity_1 = require("./subscriptions.plan.entity");
const subscriptions_plan_service_1 = require("./subscriptions.plan.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const subscriptions_plan_input_1 = require("./subscriptions.plan.input");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const companies_service_1 = require("../companies/companies.service");
const services_service_1 = require("../services/services.service");
const rxjs_1 = require("rxjs");
const subscriptions_plan_paginate_1 = require("./types/subscriptions.plan.paginate");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const auth_plans_guard_1 = require("../../auth/auth.plans.guard");
const auth_plans_decorator_1 = require("../../auth/auth.plans.decorator");
const users_plan_enum_1 = require("../users/users.plan.enum");
let SubscriptionsPlanResolver = class SubscriptionsPlanResolver {
    constructor(subscriptionsPlanService, companiesService, servicesService) {
        this.subscriptionsPlanService = subscriptionsPlanService;
        this.companiesService = companiesService;
        this.servicesService = servicesService;
    }
    async prepareEntity(entity, payload, company) {
        if (company) {
            entity.company = company;
        }
        entity.title = payload.title;
        entity.price = payload.price;
        entity.validity = payload.validity;
        entity.unit = payload.unit;
        entity.activationType = payload.activationType;
        entity.visits = payload.visits;
        entity.currency = payload.currency;
        entity.services = await Promise.all(payload.serviceIds.map(async (id) => {
            var _a;
            return await this.servicesService.findOneBy({
                company: {
                    id: (company === null || company === void 0 ? void 0 : company.id) || ((_a = entity.company) === null || _a === void 0 ? void 0 : _a.id),
                },
                id: id,
            });
        }));
        return entity;
    }
    async addSubscriptionPlan(user, companyId, payload) {
        const company = await this.companiesService.getCompanyByUser(companyId, user);
        if (company) {
            const entity = new subscriptions_plan_entity_1.SubscriptionsPlanEntity();
            return await this.subscriptionsPlanService.add(await this.prepareEntity(entity, payload, company));
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async updateSubscriptionPlan(user, companyId, payload, id) {
        const entity = await this.subscriptionsPlanService.getSubscriptionsPlanById(user.id, companyId, id);
        if (entity) {
            return await this.subscriptionsPlanService.update(await this.prepareEntity(entity, payload));
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async getSubscriptionPlans(user, companyId, filters, sorters, offset, limit) {
        const builder = this.subscriptionsPlanService.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.company', 'company')
            .leftJoinAndSelect('e.services', 'service')
            .leftJoinAndSelect('company.users', 'users')
            .andWhere(`e.archived is FALSE`)
            .andWhere(`users.id IN(${user.id})`)
            .andWhere(`company.hash = '${companyId}'`);
        const [data, count] = await builder.getManyAndCount();
        return new subscriptions_plan_paginate_1.default(data, count, offset, limit);
    }
    async getSubscriptionPlan(user, companyId, id) {
        return await this.subscriptionsPlanService.getSubscriptionsPlanById(user.id, companyId, id);
    }
    async removeSubscriptionPlan(user, companyId, id) {
        const entity = await this.subscriptionsPlanService.getSubscriptionsPlanById(user.id, companyId, id);
        if (entity) {
            entity.archived = true;
            return this.subscriptionsPlanService.update(entity);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => subscriptions_plan_entity_1.SubscriptionsPlanEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, subscriptions_plan_input_1.SubscriptionsPlanInput]),
    __metadata("design:returntype", Promise)
], SubscriptionsPlanResolver.prototype, "addSubscriptionPlan", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => subscriptions_plan_entity_1.SubscriptionsPlanEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('payload')),
    __param(3, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, subscriptions_plan_input_1.SubscriptionsPlanInput, Number]),
    __metadata("design:returntype", Promise)
], SubscriptionsPlanResolver.prototype, "updateSubscriptionPlan", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Query)(() => subscriptions_plan_paginate_1.default),
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
], SubscriptionsPlanResolver.prototype, "getSubscriptionPlans", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Query)(() => subscriptions_plan_entity_1.SubscriptionsPlanEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number]),
    __metadata("design:returntype", Promise)
], SubscriptionsPlanResolver.prototype, "getSubscriptionPlan", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => subscriptions_plan_entity_1.SubscriptionsPlanEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number]),
    __metadata("design:returntype", Promise)
], SubscriptionsPlanResolver.prototype, "removeSubscriptionPlan", null);
SubscriptionsPlanResolver = __decorate([
    (0, graphql_1.Resolver)(() => subscriptions_plan_entity_1.SubscriptionsPlanEntity),
    (0, auth_plans_decorator_1.Plans)(users_plan_enum_1.PlanTypes.MEDIUM, users_plan_enum_1.PlanTypes.PRO),
    __metadata("design:paramtypes", [subscriptions_plan_service_1.SubscriptionsPlanService,
        companies_service_1.CompaniesService,
        services_service_1.ServicesService])
], SubscriptionsPlanResolver);
exports.SubscriptionsPlanResolver = SubscriptionsPlanResolver;
//# sourceMappingURL=subscriptions.plan.resolver.js.map