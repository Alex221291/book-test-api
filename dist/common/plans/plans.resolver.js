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
var PlansResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const plans_services_1 = require("./plans.services");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const plans_entity_1 = require("./plans.entity");
const users_service_1 = require("../users/users.service");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const date_1 = require("../../base/utils/date");
let PlansResolver = PlansResolver_1 = class PlansResolver {
    constructor(plansService, usersService) {
        this.plansService = plansService;
        this.usersService = usersService;
    }
    async getPlans() {
        return await this.plansService.findAll();
    }
    async upgradePlan(user, code) {
        const plan = await this.plansService.findOneBy({ code });
        if (plan) {
            const currentUser = await this.usersService.findOneBy({ id: user.id });
            const price = plan.profit * plan.ordersLimit;
            if (Number(currentUser.balance) < price) {
                throw new common_1.ForbiddenException('low.user.balance');
            }
            if (currentUser.plan.level > plan.level) {
                throw new common_1.ForbiddenException('downgrade.forbidden');
            }
            currentUser.plan = plan;
            currentUser.startOf = (0, date_1.default)().toJSDate();
            return await this.usersService.update(currentUser);
        }
    }
    async downgradePlan(user, code) {
        const plan = await this.plansService.findOneBy({ code });
        const currentUser = await this.usersService.findOneBy({ id: user.id });
        if (plan && currentUser.plan.level > plan.level) {
            currentUser.plan = plan;
            currentUser.startOf = (0, date_1.default)().toJSDate();
            return await this.usersService.update(currentUser);
        }
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [plans_entity_1.PlansEntity]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlansResolver.prototype, "getPlans", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => users_entity_1.UserEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], PlansResolver.prototype, "upgradePlan", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => users_entity_1.UserEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], PlansResolver.prototype, "downgradePlan", null);
PlansResolver = PlansResolver_1 = __decorate([
    (0, graphql_1.Resolver)(() => PlansResolver_1),
    __metadata("design:paramtypes", [plans_services_1.PlansService,
        users_service_1.UsersService])
], PlansResolver);
exports.PlansResolver = PlansResolver;
//# sourceMappingURL=plans.resolver.js.map