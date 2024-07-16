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
exports.GroupsCustomersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const groups_customers_entity_1 = require("./groups.customers.entity");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const groups_customers_service_1 = require("./groups.customers.service");
const companies_service_1 = require("../companies/companies.service");
const groups_service_1 = require("./groups.service");
const groups_customers_input_1 = require("./groups.customers.input");
const customer_service_1 = require("../customers/customer.service");
const rxjs_1 = require("rxjs");
let GroupsCustomersResolver = class GroupsCustomersResolver {
    constructor(groupService, companiesService, groupsCustomersService, customerService) {
        this.groupService = groupService;
        this.companiesService = companiesService;
        this.groupsCustomersService = groupsCustomersService;
        this.customerService = customerService;
    }
    async addCustomerToGroup(user, companyId, payload) {
        const company = await this.companiesService.getCompanyByUser(companyId, user);
        if (company) {
            const entity = new groups_customers_entity_1.GroupsCustomersEntity();
            entity.group = await this.groupService.findOneBy({
                id: payload.group,
                office: {
                    company: {
                        hash: companyId,
                        users: {
                            id: user.id,
                        },
                    },
                },
            });
            entity.customer = await this.customerService.findOneBy({
                id: payload.customer,
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            });
            return this.groupsCustomersService.add(entity);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async updateGroupCustomer(user, id, companyId, payload) {
        const entity = await this.groupsCustomersService.findOneBy({
            id: id,
            customer: {
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            },
        });
        if (entity) {
            entity.group = await this.groupService.findOneBy({
                id: payload.group,
                office: {
                    company: {
                        hash: companyId,
                        users: {
                            id: user.id,
                        },
                    },
                },
            });
            entity.customer = await this.customerService.findOneBy({
                id: payload.customer,
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            });
            return this.groupsCustomersService.update(entity);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async removeCustomerFromGroup(user, companyId, id) {
        const entity = await this.groupsCustomersService.findOneBy({
            id,
            customer: {
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            },
        });
        if (entity) {
            await this.groupsCustomersService.remove(id);
            return true;
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => groups_customers_entity_1.GroupsCustomersEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, groups_customers_input_1.GroupsCustomersInput]),
    __metadata("design:returntype", Promise)
], GroupsCustomersResolver.prototype, "addCustomerToGroup", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => groups_customers_entity_1.GroupsCustomersEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('companyId')),
    __param(3, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, String, groups_customers_input_1.GroupsCustomersInput]),
    __metadata("design:returntype", Promise)
], GroupsCustomersResolver.prototype, "updateGroupCustomer", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number]),
    __metadata("design:returntype", Promise)
], GroupsCustomersResolver.prototype, "removeCustomerFromGroup", null);
GroupsCustomersResolver = __decorate([
    (0, graphql_1.Resolver)(() => groups_customers_entity_1.GroupsCustomersEntity),
    __metadata("design:paramtypes", [groups_service_1.GroupsService,
        companies_service_1.CompaniesService,
        groups_customers_service_1.GroupsCustomersService,
        customer_service_1.CustomerService])
], GroupsCustomersResolver);
exports.GroupsCustomersResolver = GroupsCustomersResolver;
//# sourceMappingURL=groups.customers.resolver.js.map