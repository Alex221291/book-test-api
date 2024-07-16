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
exports.WebFormEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const generateHash_1 = require("../../base/utils/generateHash");
const offices_entity_1 = require("../offices/offices.entity");
const employees_entity_1 = require("../employees/employees.entity");
const services_entity_1 = require("../services/services.entity");
const bookings_entity_1 = require("../bookings/bookings.entity");
let WebFormEntity = class WebFormEntity extends typeorm_1.BaseEntity {
    constructor() {
        super();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.hash = (0, generateHash_1.default)();
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], WebFormEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WebFormEntity.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WebFormEntity.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WebFormEntity.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], WebFormEntity.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], WebFormEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], WebFormEntity.prototype, "hash", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], WebFormEntity.prototype, "pinProtection", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], WebFormEntity.prototype, "isProtected", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], WebFormEntity.prototype, "archived", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ default: 60 }),
    __metadata("design:type", Number)
], WebFormEntity.prototype, "delay", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ default: 15 }),
    __metadata("design:type", Number)
], WebFormEntity.prototype, "pitch", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], WebFormEntity.prototype, "firstStepHidden", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { default: 30 }),
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], WebFormEntity.prototype, "maxAppointmentPeriod", void 0);
__decorate([
    (0, graphql_1.Field)(() => offices_entity_1.OfficesEntity),
    (0, typeorm_1.ManyToOne)(() => offices_entity_1.OfficesEntity, (entity) => entity.webForms, { eager: true }),
    __metadata("design:type", offices_entity_1.OfficesEntity)
], WebFormEntity.prototype, "office", void 0);
__decorate([
    (0, graphql_1.Field)(() => [employees_entity_1.EmployeeEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => employees_entity_1.EmployeeEntity, (entity) => entity.webForms, {
        eager: true,
    }),
    __metadata("design:type", Array)
], WebFormEntity.prototype, "employees", void 0);
__decorate([
    (0, graphql_1.Field)(() => [services_entity_1.ServiceEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => services_entity_1.ServiceEntity, (entity) => entity.webForms),
    __metadata("design:type", Array)
], WebFormEntity.prototype, "services", void 0);
__decorate([
    (0, graphql_1.Field)(() => [bookings_entity_1.BookingEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => bookings_entity_1.BookingEntity, (entity) => entity.office),
    __metadata("design:type", Array)
], WebFormEntity.prototype, "bookings", void 0);
WebFormEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('forms'),
    __metadata("design:paramtypes", [])
], WebFormEntity);
exports.WebFormEntity = WebFormEntity;
//# sourceMappingURL=webform.entity.js.map