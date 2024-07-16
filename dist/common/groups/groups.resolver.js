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
exports.GroupsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const groups_entity_1 = require("./groups.entity");
const groups_service_1 = require("./groups.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const groups_input_1 = require("./groups.input");
const companies_service_1 = require("../companies/companies.service");
const rxjs_1 = require("rxjs");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const groups_paginate_1 = require("./types/groups.paginate");
const services_service_1 = require("../services/services.service");
const offices_service_1 = require("../offices/offices.service");
const auth_plans_guard_1 = require("../../auth/auth.plans.guard");
const auth_plans_decorator_1 = require("../../auth/auth.plans.decorator");
const users_plan_enum_1 = require("../users/users.plan.enum");
let GroupsResolver = class GroupsResolver {
    constructor(groupService, companiesService, serviceService, officesService) {
        this.groupService = groupService;
        this.companiesService = companiesService;
        this.serviceService = serviceService;
        this.officesService = officesService;
    }
    async addGroup(user, companyId, payload) {
        const company = await this.companiesService.getCompanyByUser(companyId, user);
        if (company) {
            const entity = new groups_entity_1.GroupsEntity();
            entity.title = payload.title;
            entity.sinceDate = payload.sinceDate;
            entity.untilDate = payload.untilDate;
            entity.service = await this.serviceService.findOneBy({
                id: payload.serviceId,
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            });
            entity.office = await this.officesService.findOneBy({
                id: payload.officeId,
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            });
            return await this.groupService.add(entity);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async updateGroup(user, companyId, id, payload) {
        const group = await this.groupService.findOneBy({
            id: id,
            archived: false,
            office: {
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            },
        });
        if (group) {
            group.title = payload.title;
            group.sinceDate = payload.sinceDate;
            group.untilDate = payload.untilDate;
            group.service = await this.serviceService.findOneBy({
                id: payload.serviceId,
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            });
            group.office = await this.officesService.findOneBy({
                id: payload.officeId,
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            });
            return await this.groupService.update(group);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async removeGroup(user, companyId, id) {
        const group = await this.groupService.findOneBy({
            id: id,
            archived: false,
            office: {
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            },
        });
        if (group) {
            group.archived = true;
            return await this.groupService.update(group);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async getGroup(user, companyId, id) {
        return await this.groupService.findOneBy({
            id: id,
            archived: false,
            office: {
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            },
        }, {
            customers: {
                customer: true,
            },
            schedules: {
                employee: true,
            },
            service: true,
            office: true,
        });
    }
    async getGroups(user, companyId, filters, sorters, offset, limit) {
        const builder = this.groupService.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.office', 'office')
            .leftJoinAndSelect('e.service', 'service')
            .leftJoinAndSelect('e.customers', 'customers')
            .leftJoinAndSelect('e.schedules', 'schedules')
            .leftJoinAndSelect('schedules.employee', 'employee')
            .leftJoinAndSelect('office.company', 'company')
            .leftJoinAndSelect('company.users', 'users')
            .andWhere(`e.archived is FALSE`)
            .andWhere(`users.id IN(${user.id})`)
            .andWhere(`company.hash = '${companyId}'`);
        const [data, count] = await builder.getManyAndCount();
        return new groups_paginate_1.default(data, count, offset, limit);
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => groups_entity_1.GroupsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, groups_input_1.GroupsInput]),
    __metadata("design:returntype", Promise)
], GroupsResolver.prototype, "addGroup", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => groups_entity_1.GroupsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(3, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number, groups_input_1.GroupsInput]),
    __metadata("design:returntype", Promise)
], GroupsResolver.prototype, "updateGroup", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Mutation)(() => groups_entity_1.GroupsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number]),
    __metadata("design:returntype", Promise)
], GroupsResolver.prototype, "removeGroup", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Query)(() => groups_entity_1.GroupsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number]),
    __metadata("design:returntype", Promise)
], GroupsResolver.prototype, "getGroup", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_plans_guard_1.AuthPlansGuard),
    (0, graphql_1.Query)(() => groups_paginate_1.default),
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
], GroupsResolver.prototype, "getGroups", null);
GroupsResolver = __decorate([
    (0, graphql_1.Resolver)(() => groups_entity_1.GroupsEntity),
    (0, auth_plans_decorator_1.Plans)(users_plan_enum_1.PlanTypes.MEDIUM, users_plan_enum_1.PlanTypes.PRO),
    __metadata("design:paramtypes", [groups_service_1.GroupsService,
        companies_service_1.CompaniesService,
        services_service_1.ServicesService,
        offices_service_1.OfficesService])
], GroupsResolver);
exports.GroupsResolver = GroupsResolver;
//# sourceMappingURL=groups.resolver.js.map