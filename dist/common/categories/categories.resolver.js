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
var CategoriesResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const categories_service_1 = require("./categories.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const categories_paginate_1 = require("./types/categories.paginate");
const categories_entity_1 = require("./categories.entity");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const categories_input_1 = require("./categories.input");
const rxjs_1 = require("rxjs");
let CategoriesResolver = CategoriesResolver_1 = class CategoriesResolver {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async getCategories(companyId, filters, sorters, offset, limit) {
        const builder = this.categoriesService.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.services', 'services')
            .leftJoinAndSelect('e.company', 'company')
            .andWhere('e.archived is not TRUE')
            .andWhere(`company.hash = '${companyId}'`);
        const [data, count] = await builder.getManyAndCount();
        return new categories_paginate_1.default(data, count, offset, limit);
    }
    async getCategoryById(user, id, companyId) {
        return await this.categoriesService.findOneBy({
            id: id,
            archived: false,
            company: {
                hash: companyId,
                users: {
                    id: user.id,
                },
            },
        });
    }
    async updateCategory(user, id, payload, companyId) {
        const category = await this.categoriesService.findOneBy({
            id: id,
            archived: false,
            company: {
                hash: companyId,
                users: {
                    id: user.id,
                },
            },
        });
        if (category) {
            category.title = payload.title;
            return this.categoriesService.update(category);
        }
        else {
            throw new rxjs_1.NotFoundError('Category not found');
        }
    }
    async removeCategory(user, id, companyId) {
        const category = await this.categoriesService.findOneBy({
            id: id,
            archived: false,
            company: {
                hash: companyId,
                users: {
                    id: user.id,
                },
            },
        });
        if (category) {
            category.archived = true;
            return this.categoriesService.update(category);
        }
        else {
            throw new rxjs_1.NotFoundError('Category not found');
        }
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => categories_paginate_1.default),
    __param(0, (0, graphql_1.Args)('companyId')),
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
], CategoriesResolver.prototype, "getCategories", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => categories_entity_1.CategoriesEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => categories_entity_1.CategoriesEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('entity')),
    __param(3, (0, graphql_1.Args)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, categories_input_1.CategoriesInput, String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "updateCategory", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => categories_entity_1.CategoriesEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "removeCategory", null);
CategoriesResolver = CategoriesResolver_1 = __decorate([
    (0, graphql_1.Resolver)(() => CategoriesResolver_1),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesResolver);
exports.CategoriesResolver = CategoriesResolver;
//# sourceMappingURL=categories.resolver.js.map