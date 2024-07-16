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
var WebFormResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebFormResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const webform_service_1 = require("./webform.service");
const webform_entity_1 = require("./webform.entity");
const webform_paginate_1 = require("./types/webform.paginate");
const webform_input_1 = require("./webform.input");
const employees_service_1 = require("../employees/employees.service");
let WebFormResolver = WebFormResolver_1 = class WebFormResolver {
    constructor(service, employeesService) {
        this.service = service;
        this.employeesService = employeesService;
    }
    async getAllWebForms(user, companyId, filters, sorters, offset, limit) {
        return this.service.getWebFormList([user.id], companyId, filters, sorters, offset, limit);
    }
    async getWebFormById(user, id) {
        return await this.service.getWebForm({ id }, user);
    }
    async getWebForm(hash) {
        return await this.service.getWebFormByHash(hash);
    }
    async addWebForm(user, payload) {
        return this.service.add(await this.service.prepare(new webform_entity_1.WebFormEntity(), payload, user.id));
    }
    async updateWebForm(user, id, payload) {
        return this.service.update(await this.service.prepare(await this.service.getWebForm({ id }, user), payload, user.id));
    }
    async removeWebForm(user, id) {
        return await this.service.getWebForm({ id }, user);
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => webform_paginate_1.default),
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
], WebFormResolver.prototype, "getAllWebForms", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => webform_entity_1.WebFormEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], WebFormResolver.prototype, "getWebFormById", null);
__decorate([
    (0, graphql_1.Query)(() => webform_entity_1.WebFormEntity),
    __param(0, (0, graphql_1.Args)('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebFormResolver.prototype, "getWebForm", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => webform_entity_1.WebFormEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity,
        webform_input_1.WebFormInput]),
    __metadata("design:returntype", Promise)
], WebFormResolver.prototype, "addWebForm", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => webform_entity_1.WebFormEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, webform_input_1.WebFormInput]),
    __metadata("design:returntype", Promise)
], WebFormResolver.prototype, "updateWebForm", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => webform_entity_1.WebFormEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], WebFormResolver.prototype, "removeWebForm", null);
WebFormResolver = WebFormResolver_1 = __decorate([
    (0, graphql_1.Resolver)(() => WebFormResolver_1),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => employees_service_1.EmployeesService))),
    __metadata("design:paramtypes", [webform_service_1.WebFormService,
        employees_service_1.EmployeesService])
], WebFormResolver);
exports.WebFormResolver = WebFormResolver;
//# sourceMappingURL=webform.resolver.js.map