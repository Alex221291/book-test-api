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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const companies_entity_1 = require("../companies/companies.entity");
const md5_1 = require("../../base/utils/md5");
const generateHash_1 = require("../../base/utils/generateHash");
const employees_entity_1 = require("../employees/employees.entity");
const users_role_enum_1 = require("./users.role.enum");
const users_status_enum_1 = require("./users.status.enum");
const plans_entity_1 = require("../plans/plans.entity");
const payments_entity_1 = require("../payments/payments.entity");
const parsePhoneNumber_1 = require("../../base/utils/parsePhoneNumber");
let UserEntity = class UserEntity extends typeorm_1.BaseEntity {
    constructor(phone = '', plainPassword = '') {
        super();
        this.phone = (0, parsePhoneNumber_1.default)(phone);
        this.password = (0, md5_1.default)(plainPassword);
        this.hash = (0, generateHash_1.default)();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "confirmed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "hash", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], UserEntity.prototype, "birthday", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ default: '0.00' }),
    __metadata("design:type", String)
], UserEntity.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "active", void 0);
__decorate([
    (0, graphql_1.Field)(() => users_role_enum_1.RoleTypes),
    (0, typeorm_1.Column)({ default: users_role_enum_1.RoleTypes.OWNER }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(() => plans_entity_1.PlansEntity),
    (0, typeorm_1.ManyToOne)(() => plans_entity_1.PlansEntity, (entity) => entity.users, { eager: true }),
    __metadata("design:type", plans_entity_1.PlansEntity)
], UserEntity.prototype, "plan", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ default: users_status_enum_1.UsersStatus.UNCOMPLETED }),
    __metadata("design:type", String)
], UserEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], UserEntity.prototype, "paidUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], UserEntity.prototype, "startOf", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [companies_entity_1.CompanyEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => companies_entity_1.CompanyEntity, (company) => company.users),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], UserEntity.prototype, "companies", void 0);
__decorate([
    (0, graphql_1.Field)(() => [employees_entity_1.EmployeeEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => employees_entity_1.EmployeeEntity, (entity) => entity.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "employees", void 0);
__decorate([
    (0, graphql_1.Field)(() => [payments_entity_1.PaymentsEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => payments_entity_1.PaymentsEntity, (entity) => entity.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "payments", void 0);
UserEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'users' }),
    __metadata("design:paramtypes", [Object, Object])
], UserEntity);
exports.UserEntity = UserEntity;
//# sourceMappingURL=users.entity.js.map