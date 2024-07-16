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
exports.CustomerEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const bookings_entity_1 = require("../bookings/bookings.entity");
const subscriptions_entity_1 = require("../subscriptions/subscriptions.entity");
const groups_customers_entity_1 = require("../groups/groups.customers.entity");
const offices_entity_1 = require("../offices/offices.entity");
const companies_entity_1 = require("../companies/companies.entity");
const tags_entity_1 = require("../tags/tags.entity");
const class_transformer_1 = require("class-transformer");
const users_role_enum_1 = require("../users/users.role.enum");
let CustomerEntity = class CustomerEntity extends typeorm_1.BaseEntity {
    constructor() {
        super();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ unique: false }),
    (0, class_transformer_1.Expose)({
        groups: [
            users_role_enum_1.RoleTypes.OWNER,
            users_role_enum_1.RoleTypes.ADMIN_EXTERNAL,
            users_role_enum_1.RoleTypes.EMPLOYEE_EXTERNAL,
        ],
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, defaultValue: '' }),
    (0, typeorm_1.Column)({ nullable: true, default: '' }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, defaultValue: '' }),
    (0, typeorm_1.Column)({ nullable: true, default: '' }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "loyalty", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "blocked", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "birthday", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, length: 2 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "gender", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 10485760 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CustomerEntity.prototype, "archived", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => companies_entity_1.CompanyEntity),
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.CompanyEntity, (entity) => entity.customers, { eager: true }),
    __metadata("design:type", companies_entity_1.CompanyEntity)
], CustomerEntity.prototype, "company", void 0);
__decorate([
    (0, graphql_1.Field)(() => [bookings_entity_1.BookingEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => bookings_entity_1.BookingEntity, (entity) => entity.customer),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "bookings", void 0);
__decorate([
    (0, graphql_1.Field)(() => [subscriptions_entity_1.SubscriptionsEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => subscriptions_entity_1.SubscriptionsEntity, (entity) => entity.customer),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "subscriptions", void 0);
__decorate([
    (0, graphql_1.Field)(() => [groups_customers_entity_1.GroupsCustomersEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => groups_customers_entity_1.GroupsCustomersEntity, (entity) => entity.group),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "groups", void 0);
__decorate([
    (0, graphql_1.Field)(() => [tags_entity_1.TagsEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => tags_entity_1.TagsEntity, (entity) => entity.customers, {
        eager: true,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "tags", void 0);
__decorate([
    (0, graphql_1.Field)(() => [offices_entity_1.OfficesEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => offices_entity_1.OfficesEntity, (entity) => entity.customers, {
        eager: true,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "offices", void 0);
CustomerEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'customers' }),
    __metadata("design:paramtypes", [])
], CustomerEntity);
exports.CustomerEntity = CustomerEntity;
//# sourceMappingURL=customer.entity.js.map