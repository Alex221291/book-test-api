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
exports.ServicesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const services_entity_1 = require("./services.entity");
const services_service_1 = require("./services.service");
const services_input_1 = require("./services.input");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const rxjs_1 = require("rxjs");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const services_paginate_1 = require("./types/services.paginate");
const companies_service_1 = require("../companies/companies.service");
let ServicesResolver = class ServicesResolver {
    constructor(servicesService, companiesService) {
        this.servicesService = servicesService;
        this.companiesService = companiesService;
    }
    async getAllServices(companyId, filters, sorters, offset, limit) {
        const builder = this.servicesService.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.company', 'company')
            .leftJoinAndSelect('e.employees', 'employees')
            .leftJoinAndSelect('e.tags', 'tags')
            .leftJoinAndSelect('e.category', 'category');
        builder
            .andWhere(`e.archived = FALSE`)
            .andWhere(`company.hash = '${companyId}'`);
        const [data, count] = await builder.getManyAndCount();
        return new services_paginate_1.default(data, count, offset, limit);
    }
    async addService(user, hash, payload) {
        const company = await this.companiesService.getCompanyByUser(hash, user);
        if (company) {
            return this.servicesService.add(await this.servicesService.prepare(payload, new services_entity_1.ServiceEntity(), company));
        }
        else {
            throw new rxjs_1.NotFoundError('Company not found');
        }
    }
    async updateService(user, id, payload) {
        const service = await this.servicesService.getService({ id }, user.id);
        if (service) {
            return this.servicesService.update(await this.servicesService.prepare(payload, service, service.company));
        }
        throw new rxjs_1.NotFoundError('service.not.found');
    }
    async removeService(user, id) {
        const service = await this.servicesService.getService({ id }, user.id);
        if (service) {
            service.archived = true;
            service.webForms = [];
            return this.servicesService.update(service);
        }
        throw new rxjs_1.NotFoundError('service.not.found');
    }
    async getServiceById(id) {
        return this.servicesService.findOneBy({
            id: id,
        });
    }
    async addServiceTag(user, serviceId, tagId) {
        return this.servicesService.addTag(serviceId, tagId, user.id);
    }
    async removeServiceTag(user, serviceId, tagId) {
        return this.servicesService.removeTag(serviceId, tagId, user.id);
    }
};
__decorate([
    (0, graphql_1.Query)(() => services_paginate_1.default),
    __param(0, (0, graphql_1.Args)('company')),
    __param(1, (0, graphql_1.Args)('filters', {
        nullable: true,
        defaultValue: [{ operator: 'AND', filters: [] }],
        type: () => [filters_type_1.default],
    })),
    __param(2, (0, graphql_1.Args)('sorters', { nullable: true, type: () => [sorter_type_1.default] })),
    __param(3, (0, graphql_1.Args)('offset', { type: () => graphql_1.Int, nullable: true })),
    __param(4, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Array, Number, Number]),
    __metadata("design:returntype", Promise)
], ServicesResolver.prototype, "getAllServices", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => services_entity_1.ServiceEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('company')),
    __param(2, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, services_input_1.ServiceInput]),
    __metadata("design:returntype", Promise)
], ServicesResolver.prototype, "addService", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => services_entity_1.ServiceEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, services_input_1.ServiceInput]),
    __metadata("design:returntype", Promise)
], ServicesResolver.prototype, "updateService", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => services_entity_1.ServiceEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], ServicesResolver.prototype, "removeService", null);
__decorate([
    (0, graphql_1.Query)(() => services_entity_1.ServiceEntity),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ServicesResolver.prototype, "getServiceById", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => services_entity_1.ServiceEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('serviceId')),
    __param(2, (0, graphql_1.Args)('tagId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, Number]),
    __metadata("design:returntype", Promise)
], ServicesResolver.prototype, "addServiceTag", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => services_entity_1.ServiceEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('serviceId')),
    __param(2, (0, graphql_1.Args)('tagId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, Number]),
    __metadata("design:returntype", Promise)
], ServicesResolver.prototype, "removeServiceTag", null);
ServicesResolver = __decorate([
    (0, graphql_1.Resolver)(() => services_entity_1.ServiceEntity),
    __metadata("design:paramtypes", [services_service_1.ServicesService,
        companies_service_1.CompaniesService])
], ServicesResolver);
exports.ServicesResolver = ServicesResolver;
//# sourceMappingURL=services.resolver.js.map