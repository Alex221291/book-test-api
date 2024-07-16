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
var OfficesResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const offices_service_1 = require("./offices.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const offices_paginate_1 = require("./types/offices.paginate");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const offices_entity_1 = require("./offices.entity");
const offices_input_1 = require("./offices.input");
const companies_service_1 = require("../companies/companies.service");
const rxjs_1 = require("rxjs");
const parsePhoneNumber_1 = require("../../base/utils/parsePhoneNumber");
let OfficesResolver = OfficesResolver_1 = class OfficesResolver {
    constructor(officesService, companyService) {
        this.officesService = officesService;
        this.companyService = companyService;
    }
    async getMyOffices(user) {
        const company = await this.companyService.findAllBy({
            users: {
                id: user.id,
            },
        });
        const ids = company.map(({ id }) => id);
        const builder = this.officesService.findWithQueryBuilder();
        builder
            .leftJoinAndSelect('e.company', 'company')
            .leftJoinAndSelect('e.employees', 'employees')
            .leftJoinAndSelect('employees.services', 'services')
            .leftJoinAndSelect('employees.photo', 'photo')
            .where('company.id IN (:ids)', { ids })
            .andWhere('e.archived = false');
        return await builder.getMany();
    }
    async getOffices(user, companyId, filters, sorters, offset, limit) {
        const builder = this.officesService.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.company', 'company')
            .leftJoinAndSelect('company.users', 'users')
            .leftJoinAndSelect('e.employees', 'employees');
        builder
            .andWhere(`e.archived = FALSE`)
            .andWhere(`company.hash = '${companyId}'`)
            .andWhere(`users.id IN(${user.id})`);
        const [data, count] = await builder.getManyAndCount();
        return new offices_paginate_1.default(data, count, offset, limit);
    }
    async addOffice(user, companyId, payload) {
        const company = await this.companyService.getCompanyByUser(companyId, user);
        if (company) {
            const entity = new offices_entity_1.OfficesEntity();
            entity.title = payload.title;
            entity.address = payload.address;
            entity.company = company;
            entity.phone = (0, parsePhoneNumber_1.default)(payload.phone);
            entity.workingDays = payload.workingDays;
            return this.officesService.add(entity);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async updateOffice(user, id, companyId, payload) {
        const entity = await this.officesService.findOneBy({
            id,
            archived: false,
            company: {
                hash: companyId,
                users: {
                    id: user.id,
                },
            },
        });
        if (entity) {
            entity.title = payload.title;
            entity.address = payload.address;
            entity.phone = (0, parsePhoneNumber_1.default)(payload.phone);
            entity.workingDays = payload.workingDays;
            return this.officesService.update(entity);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async removeOffice(user, id) {
        const entity = await this.officesService.findOneBy({
            id,
            archived: false,
            company: {
                users: {
                    id: user.id,
                },
            },
        });
        if (entity) {
            entity.archived = true;
            try {
                return await this.officesService.update(entity);
            }
            catch (e) {
                throw new Error(e.message);
            }
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async getOffice(user, id, companyId) {
        return await this.officesService.findOneBy({
            id,
            archived: false,
            company: {
                hash: companyId,
                users: {
                    id: user.id,
                },
            },
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [offices_entity_1.OfficesEntity]),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], OfficesResolver.prototype, "getMyOffices", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => offices_paginate_1.default),
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
], OfficesResolver.prototype, "getOffices", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => offices_entity_1.OfficesEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, offices_input_1.OfficesInput]),
    __metadata("design:returntype", Promise)
], OfficesResolver.prototype, "addOffice", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => offices_entity_1.OfficesEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('companyId')),
    __param(3, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, String, offices_input_1.OfficesInput]),
    __metadata("design:returntype", Promise)
], OfficesResolver.prototype, "updateOffice", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => offices_entity_1.OfficesEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], OfficesResolver.prototype, "removeOffice", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => offices_entity_1.OfficesEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, String]),
    __metadata("design:returntype", Promise)
], OfficesResolver.prototype, "getOffice", null);
OfficesResolver = OfficesResolver_1 = __decorate([
    (0, graphql_1.Resolver)(() => OfficesResolver_1),
    __metadata("design:paramtypes", [offices_service_1.OfficesService,
        companies_service_1.CompaniesService])
], OfficesResolver);
exports.OfficesResolver = OfficesResolver;
//# sourceMappingURL=offices.resolver.js.map