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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../common/users/users.service");
const md5_1 = require("../base/utils/md5");
const users_role_enum_1 = require("../common/users/users.role.enum");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(username, pass) {
        const builder = this.usersService.findWithQueryBuilder();
        builder
            .leftJoinAndSelect('e.companies', 'companies')
            .leftJoinAndSelect('e.employees', 'employees')
            .leftJoinAndSelect('e.plan', 'plan')
            .where('e.email = :email', { email: username })
            .orWhere('e.phone = :phone', { phone: username });
        const user = await builder.getOne();
        if (user && user.password === (0, md5_1.default)(pass) && user.active) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async login(user) {
        var _a, _b;
        const payload = {
            email: user.email,
            sub: user.id,
            status: user.status,
            plan: user.plan,
            role: users_role_enum_1.RoleTypes[user.role],
            employees: (_a = user.employees) === null || _a === void 0 ? void 0 : _a.map(({ id }) => id),
            companies: (_b = user.companies) === null || _b === void 0 ? void 0 : _b.map((company) => company.hash),
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map