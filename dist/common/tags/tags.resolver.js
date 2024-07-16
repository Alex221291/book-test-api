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
exports.TagsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const tags_entity_1 = require("./tags.entity");
const tags_service_1 = require("./tags.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const tags_input_1 = require("./tags.input");
const companies_service_1 = require("../companies/companies.service");
const tags_paginate_1 = require("./types/tags.paginate");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
let TagsResolver = class TagsResolver {
    constructor(tagsService, companiesService) {
        this.tagsService = tagsService;
        this.companiesService = companiesService;
    }
    async addTag(user, companyId, payload) {
        const company = await this.companiesService.getCompanyByUser(companyId, user);
        if (company) {
            const entity = new tags_entity_1.TagsEntity();
            return await this.tagsService.add(await this.tagsService.prepare(entity, payload, company));
        }
        throw new common_1.NotFoundException('company.not.found');
    }
    async updateTag(user, id, companyId, payload) {
        const company = await this.companiesService.getCompanyByUser(companyId, user);
        if (company) {
            const entity = await this.tagsService.getTag(id, user.id);
            if (entity) {
                return await this.tagsService.update(await this.tagsService.prepare(entity, payload, company));
            }
            throw new common_1.NotFoundException('tag.not.found');
        }
        throw new common_1.NotFoundException('company.not.found');
    }
    async removeTag(user, id, companyId) {
        const company = await this.companiesService.getCompanyByUser(companyId, user);
        if (company) {
            const entity = await this.tagsService.getTag(id, user.id);
            if (entity) {
                await this.tagsService.remove(entity.id);
                return true;
            }
            throw new common_1.NotFoundException('tag.not.found');
        }
        throw new common_1.NotFoundException('company.not.found');
    }
    async getTags(user, companyId, filters, sorters, offset, limit) {
        const builder = this.tagsService.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.company', 'company')
            .andWhere('company.hash = :hash', { hash: companyId });
        const [data, count] = await builder.getManyAndCount();
        return new tags_paginate_1.default(data, count, offset, limit);
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => tags_entity_1.TagsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('company')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, tags_input_1.TagsInput]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "addTag", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => tags_entity_1.TagsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('company')),
    __param(3, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, String, tags_input_1.TagsInput]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "updateTag", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('company')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, String]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "removeTag", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => tags_paginate_1.default),
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
], TagsResolver.prototype, "getTags", null);
TagsResolver = __decorate([
    (0, graphql_1.Resolver)(() => tags_entity_1.TagsEntity),
    __metadata("design:paramtypes", [tags_service_1.TagsService,
        companies_service_1.CompaniesService])
], TagsResolver);
exports.TagsResolver = TagsResolver;
//# sourceMappingURL=tags.resolver.js.map