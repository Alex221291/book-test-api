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
exports.AuthResolver = void 0;
const auth_service_1 = require("./auth.service");
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const auth_model_1 = require("./auth.model");
const users_entity_1 = require("../common/users/users.entity");
const users_service_1 = require("../common/users/users.service");
const companies_service_1 = require("../common/companies/companies.service");
const gql_auth_guard_1 = require("./gql-auth.guard");
const user_decorator_1 = require("./user.decorator");
const companies_input_1 = require("../common/companies/companies.input");
const companies_entity_1 = require("../common/companies/companies.entity");
const rxjs_1 = require("rxjs");
const generateHash_1 = require("../base/utils/generateHash");
const md5_1 = require("../base/utils/md5");
const parsePhoneNumber_1 = require("../base/utils/parsePhoneNumber");
const users_status_enum_1 = require("../common/users/users.status.enum");
const plans_services_1 = require("../common/plans/plans.services");
const generateRandomCode_1 = require("../base/utils/generateRandomCode");
const event_emitter_1 = require("@nestjs/event-emitter");
const notifications_service_1 = require("../common/notifications/notifications.service");
let AuthResolver = class AuthResolver {
    constructor(authService, userService, companyService, plansService, notificationsService, eventEmitter) {
        this.authService = authService;
        this.userService = userService;
        this.companyService = companyService;
        this.plansService = plansService;
        this.notificationsService = notificationsService;
        this.eventEmitter = eventEmitter;
    }
    async login(email, password) {
        const user = await this.authService.validateUser(email, password);
        if (user) {
            return this.authService.login(user);
        }
        else {
            throw new common_1.UnauthorizedException();
        }
    }
    async register(phone, password) {
        const entity = new users_entity_1.UserEntity(phone, password);
        entity.plan = await this.plansService.findOneBy({
            code: 'FREE',
        });
        const user = await this.userService.add(entity);
        return this.authService.login(user);
    }
    async confirmEmail(hash) {
        const user = await this.userService.findOneBy({
            hash,
            confirmed: false,
        });
        if (user) {
            user.confirmed = true;
            return this.userService.update(user);
        }
        else {
            throw new rxjs_1.NotFoundError('User not found');
        }
    }
    async resetPasswordRequest(phone) {
        const user = await this.userService.findOneBy({
            phone,
        });
        if (user) {
            user.hash = (0, generateRandomCode_1.generateRandomCode)().toString();
            await this.userService.update(user);
            this.notificationsService.sendSMS(user.phone, `PIN: ${user.hash}`);
            return true;
        }
        else {
            throw new rxjs_1.NotFoundError('User not found');
        }
    }
    async changePasswordByResettingHash(code, password) {
        const user = await this.userService.findOneBy({
            hash: code,
        });
        if (user) {
            user.hash = (0, generateHash_1.default)();
            user.password = (0, md5_1.default)(password);
            await this.userService.update(user);
            return true;
        }
        else {
            throw new rxjs_1.NotFoundError('User not found');
        }
    }
    async onBoarding(user, payload) {
        const entity = new companies_entity_1.CompanyEntity();
        entity.users = [user];
        entity.users = [user];
        entity.address = payload.address;
        entity.phone = (0, parsePhoneNumber_1.default)(payload.phone);
        entity.title = payload.title;
        entity.description = payload.description;
        entity.regNumber = payload.regNumber;
        entity.timezone = payload.timezone;
        const company = await this.companyService.add(entity);
        if (company.id) {
            const entity = await this.userService.findOneBy({ id: user.id }, {
                companies: true,
            });
            entity.status = users_status_enum_1.UsersStatus.COMPLETED;
            await this.userService.update(entity);
            return this.authService.login(entity);
        }
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => auth_model_1.AuthModel),
    __param(0, (0, graphql_1.Args)('email', { type: () => String })),
    __param(1, (0, graphql_1.Args)('password', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_model_1.AuthModel),
    __param(0, (0, graphql_1.Args)('phone', { type: () => String })),
    __param(1, (0, graphql_1.Args)('password', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
__decorate([
    (0, graphql_1.Mutation)(() => users_entity_1.UserEntity),
    __param(0, (0, graphql_1.Args)('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "confirmEmail", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "resetPasswordRequest", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('code')),
    __param(1, (0, graphql_1.Args)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "changePasswordByResettingHash", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => auth_model_1.AuthModel),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity,
        companies_input_1.CompanyInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "onBoarding", null);
AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        companies_service_1.CompaniesService,
        plans_services_1.PlansService,
        notifications_service_1.NotificationsService,
        event_emitter_1.EventEmitter2])
], AuthResolver);
exports.AuthResolver = AuthResolver;
//# sourceMappingURL=auth.resolver.js.map