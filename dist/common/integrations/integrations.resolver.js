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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var IntegrationsResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const integrations_service_1 = require("./integrations.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const integrations_entity_1 = require("./integrations.entity");
const companies_service_1 = require("../companies/companies.service");
const integrations_sms_input_1 = require("./dto/integrations.sms.input");
const integrations_type_1 = require("./integrations.type");
const integrations_telegram_input_1 = require("./dto/integrations.telegram.input");
const integrations_provider_type_1 = require("./integrations.provider.type");
const auth_plans_decorator_1 = require("../../auth/auth.plans.decorator");
const users_plan_enum_1 = require("../users/users.plan.enum");
const auth_plans_guard_1 = require("../../auth/auth.plans.guard");
let IntegrationsResolver = IntegrationsResolver_1 = class IntegrationsResolver {
    constructor(integrationsService, companyService) {
        this.integrationsService = integrationsService;
        this.companyService = companyService;
    }
    async checkIntegration(type, company) {
        const integration = await this.integrationsService.findOneBy({
            type,
            company: {
                hash: company,
            },
        });
        return !!(integration === null || integration === void 0 ? void 0 : integration.id);
    }
    async getAllIntegrations(user, company) {
        const builder = this.integrationsService.findWithQueryBuilder();
        builder
            .leftJoinAndSelect('e.company', 'company')
            .leftJoinAndSelect('company.users', 'users');
        builder
            .andWhere(`company.hash = '${company}'`)
            .andWhere(`users.id IN(${user.id})`);
        return await builder.getMany();
    }
    async getIntegration(user, type, company) {
        return await this.integrationsService.findOneBy({
            type,
            company: {
                hash: company,
                users: {
                    id: user.id,
                },
            },
        });
    }
    async connectTelegramIntegration(user, hash, payload) {
        const company = await this.companyService.findOneBy({
            hash,
            users: {
                id: user.id,
            },
        });
        if (company) {
            let integration = await this.integrationsService.findOneBy({
                type: integrations_type_1.IntegrationsType.TELEGRAM,
                company: {
                    hash: company.hash,
                },
            });
            if (!integration) {
                integration = new integrations_entity_1.IntegrationsEntity();
                integration.company = company;
                integration.type = integrations_type_1.IntegrationsType.TELEGRAM;
            }
            integration.provider = integrations_provider_type_1.IntegrationsProviderType.BOT;
            integration.config = JSON.stringify(payload);
            return this.integrationsService.update(integration);
        }
    }
    async connectSMSIntegration(user, hash, payload) {
        const company = await this.companyService.findOneBy({
            hash,
            users: {
                id: user.id,
            },
        });
        if (company) {
            let integration = await this.integrationsService.findOneBy({
                type: integrations_type_1.IntegrationsType.SMS,
                company: {
                    hash: company.hash,
                },
            });
            if (!integration) {
                integration = new integrations_entity_1.IntegrationsEntity();
                integration.company = company;
                integration.type = integrations_type_1.IntegrationsType.SMS;
            }
            const { provider } = payload, extra = __rest(payload, ["provider"]);
            integration.provider = provider;
            integration.config = JSON.stringify(extra);
            return this.integrationsService.update(integration);
        }
        else {
            throw new common_1.NotFoundException('Company not found');
        }
    }
    async removeIntegration(user, id) {
        const integration = await this.integrationsService.findOneBy({
            id,
            company: {
                users: {
                    id: user.id,
                },
            },
        });
        if (integration) {
            await this.integrationsService.remove(integration.id);
            return integration;
        }
        else {
            throw new common_1.NotFoundException('Integration not found');
        }
    }
};
__decorate([
    (0, graphql_1.Query)(() => Boolean),
    __param(0, (0, graphql_1.Args)('type')),
    __param(1, (0, graphql_1.Args)('company')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "checkIntegration", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [integrations_entity_1.IntegrationsEntity]),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('company')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "getAllIntegrations", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Query)(() => integrations_entity_1.IntegrationsEntity, { nullable: true }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('type')),
    __param(2, (0, graphql_1.Args)('company')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, String]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "getIntegration", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => integrations_entity_1.IntegrationsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('company')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, integrations_telegram_input_1.IntegrationsTelegramInput]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "connectTelegramIntegration", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => integrations_entity_1.IntegrationsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('company')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, integrations_sms_input_1.IntegrationsSmsInput]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "connectSMSIntegration", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => integrations_entity_1.IntegrationsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], IntegrationsResolver.prototype, "removeIntegration", null);
IntegrationsResolver = IntegrationsResolver_1 = __decorate([
    (0, graphql_1.Resolver)(() => IntegrationsResolver_1),
    (0, auth_plans_decorator_1.Plans)(users_plan_enum_1.PlanTypes.START, users_plan_enum_1.PlanTypes.MEDIUM, users_plan_enum_1.PlanTypes.PRO),
    __metadata("design:paramtypes", [integrations_service_1.IntegrationsService,
        companies_service_1.CompaniesService])
], IntegrationsResolver);
exports.IntegrationsResolver = IntegrationsResolver;
//# sourceMappingURL=integrations.resolver.js.map