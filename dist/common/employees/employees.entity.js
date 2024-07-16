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
exports.EmployeeEntity = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const services_entity_1 = require("../services/services.entity");
const schedules_entity_1 = require("../schedules/schedules.entity");
const file_entity_1 = require("../file/file.entity");
const users_entity_1 = require("../users/users.entity");
const offices_entity_1 = require("../offices/offices.entity");
const webform_entity_1 = require("../webforms/webform.entity");
let EmployeeEntity = class EmployeeEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmployeeEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)(() => file_entity_1.FileEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => file_entity_1.FileEntity),
    __metadata("design:type", file_entity_1.FileEntity)
], EmployeeEntity.prototype, "photo", void 0);
__decorate([
    (0, graphql_1.Field)(() => file_entity_1.FileEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => file_entity_1.FileEntity),
    __metadata("design:type", file_entity_1.FileEntity)
], EmployeeEntity.prototype, "background", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "jobTitle", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EmployeeEntity.prototype, "rate", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EmployeeEntity.prototype, "archived", void 0);
__decorate([
    (0, graphql_1.Field)(() => offices_entity_1.OfficesEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => offices_entity_1.OfficesEntity, (entity) => entity.employees, { eager: true }),
    __metadata("design:type", offices_entity_1.OfficesEntity)
], EmployeeEntity.prototype, "office", void 0);
__decorate([
    (0, graphql_1.Field)(() => users_entity_1.UserEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => users_entity_1.UserEntity, (entity) => entity.employees, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", users_entity_1.UserEntity)
], EmployeeEntity.prototype, "user", void 0);
__decorate([
    (0, graphql_1.Field)(() => [services_entity_1.ServiceEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => services_entity_1.ServiceEntity, (entity) => entity.employees),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "services", void 0);
__decorate([
    (0, graphql_1.Field)(() => [schedules_entity_1.ScheduleEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => schedules_entity_1.ScheduleEntity, (entity) => entity.employee),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "schedules", void 0);
__decorate([
    (0, graphql_1.Field)(() => [webform_entity_1.WebFormEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => webform_entity_1.WebFormEntity, (entity) => entity.employees),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "webForms", void 0);
EmployeeEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'employees' })
], EmployeeEntity);
exports.EmployeeEntity = EmployeeEntity;
//# sourceMappingURL=employees.entity.js.map