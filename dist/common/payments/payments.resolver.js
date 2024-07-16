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
var PaymentsResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const payments_service_1 = require("./payments.service");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const PaymentsPaginatedResponse_1 = require("./types/PaymentsPaginatedResponse");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
let PaymentsResolver = PaymentsResolver_1 = class PaymentsResolver {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async getPayments(user, filters, sorters, offset, limit) {
        const builder = this.paymentsService.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.user', 'user')
            .andWhere(`user.id = ${user.id}`);
        const [data, count] = await builder.getManyAndCount();
        return new PaymentsPaginatedResponse_1.default(data, count, offset, limit);
    }
    async getBalance(user, account) {
        const payment = await this.paymentsService.findOneBy({
            account_key: account,
            user: {
                id: user.id,
            },
        }, {}, { id: 'desc' });
        return (payment === null || payment === void 0 ? void 0 : payment.balance) || '0.00';
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => PaymentsPaginatedResponse_1.default),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('filters', {
        nullable: true,
        defaultValue: [{ operator: 'AND', filters: [] }],
        type: () => [filters_type_1.default],
    })),
    __param(2, (0, graphql_1.Args)('sorters', { nullable: true, type: () => [sorter_type_1.default] })),
    __param(3, (0, graphql_1.Args)('offset', { type: () => graphql_1.Int, nullable: true })),
    __param(4, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Array, Array, Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "getPayments", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => String),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('account')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "getBalance", null);
PaymentsResolver = PaymentsResolver_1 = __decorate([
    (0, graphql_1.Resolver)(() => PaymentsResolver_1),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsResolver);
exports.PaymentsResolver = PaymentsResolver;
//# sourceMappingURL=payments.resolver.js.map