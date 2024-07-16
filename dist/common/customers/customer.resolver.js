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
exports.CustomerResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const customer_entity_1 = require("./customer.entity");
const customer_service_1 = require("./customer.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const customer_paginate_1 = require("./types/customer.paginate");
const customer_input_1 = require("./customer.input");
const rxjs_1 = require("rxjs");
const parsePhoneNumber_1 = require("../../base/utils/parsePhoneNumber");
const companies_service_1 = require("../companies/companies.service");
const auth_role_guard_1 = require("../../auth/auth.role.guard");
const auth_role_decorator_1 = require("../../auth/auth.role.decorator");
const users_role_enum_1 = require("../users/users.role.enum");
const class_transformer_1 = require("class-transformer");
let CustomerResolver = class CustomerResolver {
    constructor(customerService, companiesService) {
        this.customerService = customerService;
        this.companiesService = companiesService;
    }
    async getCustomers(user, company, filters, sorters, offset, limit) {
        return this.customerService.getCustomers(filters, sorters, company, user, offset, limit);
    }
    async getCustomer(user, id) {
        const entity = await this.customerService.getCustomer({ id }, user.id);
        return (0, class_transformer_1.classToPlain)(entity, { groups: [user.role] });
    }
    async addCustomer(user, payload, companyId) {
        const customer = await this.customerService.getCustomer({
            phone: (0, parsePhoneNumber_1.default)(payload.phone),
        }, user.id);
        if (!customer) {
            const entity = new customer_entity_1.CustomerEntity();
            const company = await this.companiesService.getCompanyByUser(companyId, user);
            return await this.customerService.add(this.customerService.prepare(entity, payload, company));
        }
        else {
            throw new rxjs_1.NotFoundError('customer.already.exists');
        }
    }
    async addCustomerTag(user, customerId, tagId) {
        return this.customerService.addTag(customerId, tagId, user.id);
    }
    async removeCustomerTag(user, customerId, tagId) {
        return this.customerService.removeTag(customerId, tagId, user.id);
    }
    async updateCustomer(user, id, payload) {
        const entity = await this.customerService.getCustomer({ id }, user.id);
        if (entity) {
            return await this.customerService.update(this.customerService.prepare(entity, payload));
        }
        throw new rxjs_1.NotFoundError('customer.not.found');
    }
    async removeCustomer(user, id) {
        const entity = await this.customerService.getCustomer({ id }, user.id);
        if (entity) {
            entity.archived = true;
            return await this.customerService.update(entity);
        }
        throw new rxjs_1.NotFoundError('customer.not.found');
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => customer_paginate_1.default),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('company')),
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
], CustomerResolver.prototype, "getCustomers", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => customer_entity_1.CustomerEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "getCustomer", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => customer_entity_1.CustomerEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('entity')),
    __param(2, (0, graphql_1.Args)('company')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity,
        customer_input_1.CustomerInput, String]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "addCustomer", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_role_guard_1.AuthRoleGuard),
    (0, auth_role_decorator_1.Roles)(users_role_enum_1.RoleTypes.OWNER, users_role_enum_1.RoleTypes.ADMIN_EXTERNAL),
    (0, graphql_1.Mutation)(() => customer_entity_1.CustomerEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('customerId')),
    __param(2, (0, graphql_1.Args)('tagId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "addCustomerTag", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_role_guard_1.AuthRoleGuard),
    (0, auth_role_decorator_1.Roles)(users_role_enum_1.RoleTypes.OWNER, users_role_enum_1.RoleTypes.ADMIN_EXTERNAL),
    (0, graphql_1.Mutation)(() => customer_entity_1.CustomerEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('customerId')),
    __param(2, (0, graphql_1.Args)('tagId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "removeCustomerTag", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_role_guard_1.AuthRoleGuard),
    (0, auth_role_decorator_1.Roles)(users_role_enum_1.RoleTypes.OWNER, users_role_enum_1.RoleTypes.ADMIN_EXTERNAL, users_role_enum_1.RoleTypes.EMPLOYEE_EXTERNAL),
    (0, graphql_1.Mutation)(() => customer_entity_1.CustomerEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id')),
    __param(2, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, customer_input_1.CustomerInput]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, auth_role_guard_1.AuthRoleGuard),
    (0, auth_role_decorator_1.Roles)(users_role_enum_1.RoleTypes.OWNER),
    (0, graphql_1.Mutation)(() => customer_entity_1.CustomerEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "removeCustomer", null);
CustomerResolver = __decorate([
    (0, graphql_1.Resolver)(() => customer_entity_1.CustomerEntity),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        companies_service_1.CompaniesService])
], CustomerResolver);
exports.CustomerResolver = CustomerResolver;
//# sourceMappingURL=customer.resolver.js.map