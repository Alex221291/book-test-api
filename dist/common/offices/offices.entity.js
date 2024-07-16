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
exports.OfficesEntity = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const companies_entity_1 = require("../companies/companies.entity");
const employees_entity_1 = require("../employees/employees.entity");
const bookings_entity_1 = require("../bookings/bookings.entity");
const groups_entity_1 = require("../groups/groups.entity");
const webform_entity_1 = require("../webforms/webform.entity");
const customer_entity_1 = require("../customers/customer.entity");
let OfficesEntity = class OfficesEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OfficesEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OfficesEntity.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OfficesEntity.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OfficesEntity.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OfficesEntity.prototype, "workingDays", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], OfficesEntity.prototype, "archived", void 0);
__decorate([
    (0, graphql_1.Field)(() => companies_entity_1.CompanyEntity),
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.CompanyEntity, (entity) => entity.offices, { eager: true }),
    __metadata("design:type", companies_entity_1.CompanyEntity)
], OfficesEntity.prototype, "company", void 0);
__decorate([
    (0, graphql_1.Field)(() => [employees_entity_1.EmployeeEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => employees_entity_1.EmployeeEntity, (entity) => entity.office),
    __metadata("design:type", Array)
], OfficesEntity.prototype, "employees", void 0);
__decorate([
    (0, graphql_1.Field)(() => [customer_entity_1.CustomerEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => customer_entity_1.CustomerEntity, (entity) => entity.offices),
    __metadata("design:type", Array)
], OfficesEntity.prototype, "customers", void 0);
__decorate([
    (0, graphql_1.Field)(() => [bookings_entity_1.BookingEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => bookings_entity_1.BookingEntity, (entity) => entity.office),
    __metadata("design:type", Array)
], OfficesEntity.prototype, "bookings", void 0);
__decorate([
    (0, graphql_1.Field)(() => [groups_entity_1.GroupsEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => groups_entity_1.GroupsEntity, (entity) => entity.office),
    __metadata("design:type", Array)
], OfficesEntity.prototype, "groups", void 0);
__decorate([
    (0, graphql_1.Field)(() => [webform_entity_1.WebFormEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => webform_entity_1.WebFormEntity, (entity) => entity.office),
    __metadata("design:type", Array)
], OfficesEntity.prototype, "webForms", void 0);
OfficesEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('offices')
], OfficesEntity);
exports.OfficesEntity = OfficesEntity;
//# sourceMappingURL=offices.entity.js.map