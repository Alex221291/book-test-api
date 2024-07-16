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
exports.UsersResolver = void 0;
const users_entity_1 = require("./users.entity");
const graphql_1 = require("@nestjs/graphql");
const users_service_1 = require("./users.service");
const users_input_1 = require("./users.input");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const rxjs_1 = require("rxjs");
const md5_1 = require("../../base/utils/md5");
const parsePhoneNumber_1 = require("../../base/utils/parsePhoneNumber");
let UsersResolver = class UsersResolver {
    constructor(userService) {
        this.userService = userService;
    }
    async sendConfirmationLink(user) {
        const entity = await this.userService.findOneBy({ id: user.id });
        if (!entity.confirmed) {
            return true;
        }
        else {
            throw new rxjs_1.NotFoundError('User not found');
        }
    }
    async getUser(user) {
        return this.userService.findOneBy({ id: user.id }, {
            companies: true,
            employees: {
                photo: true,
                background: true,
                office: {
                    company: true,
                },
            },
        });
    }
    async getAllUsers() {
        return this.userService.findAll();
    }
    async addUser(entity) {
        return this.userService.add(entity);
    }
    async updateUser(user, entity) {
        var _a;
        const payload = await this.userService.findOneBy({
            id: user.id,
        });
        if (((_a = entity.email) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            payload.email = entity.email;
        }
        payload.phone = (0, parsePhoneNumber_1.default)(entity.phone);
        payload.birthday = entity.birthday;
        return this.userService.update(payload);
    }
    async changePassword(user, password, newPassword) {
        const entity = await this.userService.findOneBy({
            id: user.id,
            password: (0, md5_1.default)(password),
        });
        if (entity) {
            entity.password = (0, md5_1.default)(newPassword);
            return this.userService.update(entity);
        }
        else {
            throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
        }
    }
    async removeUser(id) {
        return this.userService.remove(id);
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "sendConfirmationLink", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => users_entity_1.UserEntity),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUser", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [users_entity_1.UserEntity]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => users_entity_1.UserEntity),
    __param(0, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_input_1.UserInput]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "addUser", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => users_entity_1.UserEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity,
        users_input_1.UserInput]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => users_entity_1.UserEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('password')),
    __param(2, (0, graphql_1.Args)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => users_entity_1.UserEntity),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "removeUser", null);
UsersResolver = __decorate([
    (0, graphql_1.Resolver)(() => users_entity_1.UserEntity),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersResolver);
exports.UsersResolver = UsersResolver;
//# sourceMappingURL=users.resolver.js.map