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
exports.ServiceEntity = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const companies_entity_1 = require("../companies/companies.entity");
const employees_entity_1 = require("../employees/employees.entity");
const schedules_entity_1 = require("../schedules/schedules.entity");
const subscriptions_plan_entity_1 = require("../subscriptions/subscriptions.plan.entity");
const groups_entity_1 = require("../groups/groups.entity");
const currency_enum_1 = require("../../base/types/currency.enum");
const categories_entity_1 = require("../categories/categories.entity");
const webform_entity_1 = require("../webforms/webform.entity");
const tags_entity_1 = require("../tags/tags.entity");
let ServiceEntity = class ServiceEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ServiceEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ServiceEntity.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ServiceEntity.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ServiceEntity.prototype, "duration", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], ServiceEntity.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], ServiceEntity.prototype, "maxPrice", void 0);
__decorate([
    (0, graphql_1.Field)(() => currency_enum_1.CurrencyTypes),
    (0, typeorm_1.Column)({ length: 32 }),
    __metadata("design:type", String)
], ServiceEntity.prototype, "currency", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ServiceEntity.prototype, "archived", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ServiceEntity.prototype, "weight", void 0);
__decorate([
    (0, graphql_1.Field)(() => companies_entity_1.CompanyEntity),
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.CompanyEntity, (entity) => entity.services, { eager: true }),
    __metadata("design:type", companies_entity_1.CompanyEntity)
], ServiceEntity.prototype, "company", void 0);
__decorate([
    (0, graphql_1.Field)(() => categories_entity_1.CategoriesEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => categories_entity_1.CategoriesEntity, (entity) => entity.services, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", categories_entity_1.CategoriesEntity)
], ServiceEntity.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)(() => [employees_entity_1.EmployeeEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => employees_entity_1.EmployeeEntity, (entity) => entity.services, {
        eager: true,
    }),
    __metadata("design:type", Array)
], ServiceEntity.prototype, "employees", void 0);
__decorate([
    (0, graphql_1.Field)(() => [schedules_entity_1.ScheduleEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => schedules_entity_1.ScheduleEntity, (entity) => entity.services),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ServiceEntity.prototype, "schedules", void 0);
__decorate([
    (0, graphql_1.Field)(() => [subscriptions_plan_entity_1.SubscriptionsPlanEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => subscriptions_plan_entity_1.SubscriptionsPlanEntity, (entity) => entity.services),
    __metadata("design:type", Array)
], ServiceEntity.prototype, "subscriptionPlans", void 0);
__decorate([
    (0, graphql_1.Field)(() => [groups_entity_1.GroupsEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => groups_entity_1.GroupsEntity, (entity) => entity.service),
    __metadata("design:type", Array)
], ServiceEntity.prototype, "groups", void 0);
__decorate([
    (0, graphql_1.Field)(() => [webform_entity_1.WebFormEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => webform_entity_1.WebFormEntity, (entity) => entity.services),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ServiceEntity.prototype, "webForms", void 0);
__decorate([
    (0, graphql_1.Field)(() => [tags_entity_1.TagsEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => tags_entity_1.TagsEntity, (entity) => entity.services, {
        eager: true,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ServiceEntity.prototype, "tags", void 0);
ServiceEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('services')
], ServiceEntity);
exports.ServiceEntity = ServiceEntity;
//# sourceMappingURL=services.entity.js.map