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
exports.CompaniesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const companies_entity_1 = require("./companies.entity");
const companies_service_1 = require("./companies.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const users_entity_1 = require("../users/users.entity");
const user_decorator_1 = require("../../auth/user.decorator");
const rxjs_1 = require("rxjs");
const companies_input_1 = require("./companies.input");
const file_service_1 = require("../file/file.service");
const parsePhoneNumber_1 = require("../../base/utils/parsePhoneNumber");
let CompaniesResolver = class CompaniesResolver {
    constructor(companiesService, fileService) {
        this.companiesService = companiesService;
        this.fileService = fileService;
    }
    async getCompany(company) {
        const entity = await this.companiesService.findOneBy({
            hash: company,
        }, {
            logo: true,
        });
        if (entity) {
            return entity;
        }
        else {
            throw new rxjs_1.NotFoundError('Company not found');
        }
    }
    async getCompanies(user) {
        return this.companiesService.findAllBy({
            users: {
                id: user.id,
            },
        });
    }
    async addCompany(user, payload) {
        const entity = new companies_entity_1.CompanyEntity();
        entity.users = [user];
        entity.address = payload.address;
        entity.phone = (0, parsePhoneNumber_1.default)(payload.phone);
        entity.title = payload.title;
        entity.description = payload.description;
        entity.regNumber = payload.regNumber;
        entity.timezone = payload.timezone;
        if (payload === null || payload === void 0 ? void 0 : payload.logo) {
            entity.logo = await this.fileService.findOneBy({
                filename: payload === null || payload === void 0 ? void 0 : payload.logo,
            });
        }
        return this.companiesService.add(entity);
    }
    async updateCompany(user, id, entity) {
        const company = await this.companiesService.findOneBy({
            hash: id,
            users: {
                id: user.id,
            },
        });
        if (company) {
            company.address = entity.address;
            company.phone = (0, parsePhoneNumber_1.default)(entity.phone);
            company.title = entity.title;
            company.description = entity.description;
            company.regNumber = entity.regNumber;
            company.timezone = entity.timezone;
            if (entity === null || entity === void 0 ? void 0 : entity.logo) {
                company.logo = await this.fileService.findOneBy({
                    filename: entity === null || entity === void 0 ? void 0 : entity.logo,
                });
            }
            return this.companiesService.update(company);
        }
        else {
            throw new rxjs_1.NotFoundError('Company not found');
        }
    }
    async removeCompany(user, hash) {
        const company = await this.companiesService.findOneBy({
            hash,
            users: {
                id: user.id,
            },
        });
        if (company) {
            await this.companiesService.remove(company.id);
            return company;
        }
        else {
            throw new rxjs_1.NotFoundError('Company not found');
        }
    }
};
__decorate([
    (0, graphql_1.Query)(() => companies_entity_1.CompanyEntity),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesResolver.prototype, "getCompany", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [companies_entity_1.CompanyEntity]),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], CompaniesResolver.prototype, "getCompanies", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => companies_entity_1.CompanyEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity,
        companies_input_1.CompanyInput]),
    __metadata("design:returntype", Promise)
], CompaniesResolver.prototype, "addCompany", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => companies_entity_1.CompanyEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id')),
    __param(2, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, companies_input_1.CompanyInput]),
    __metadata("design:returntype", Promise)
], CompaniesResolver.prototype, "updateCompany", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => companies_entity_1.CompanyEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], CompaniesResolver.prototype, "removeCompany", null);
CompaniesResolver = __decorate([
    (0, graphql_1.Resolver)(() => companies_entity_1.CompanyEntity),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService,
        file_service_1.FileService])
], CompaniesResolver);
exports.CompaniesResolver = CompaniesResolver;
//# sourceMappingURL=companies.resolver.js.map