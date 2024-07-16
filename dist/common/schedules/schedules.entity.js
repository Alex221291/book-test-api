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
exports.ScheduleEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const employees_entity_1 = require("../employees/employees.entity");
const bookings_entity_1 = require("../bookings/bookings.entity");
const services_entity_1 = require("../services/services.entity");
const groups_entity_1 = require("../groups/groups.entity");
const schedules_type_1 = require("./types/schedules.type");
let ScheduleEntity = class ScheduleEntity extends typeorm_1.BaseEntity {
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
], ScheduleEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => schedules_type_1.SchedulesType),
    (0, typeorm_1.Column)({ default: schedules_type_1.SchedulesType.DEFAULT }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('time'),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)('time'),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "finishTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ScheduleEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ScheduleEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ScheduleEntity.prototype, "sinceDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ScheduleEntity.prototype, "untilDate", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { default: 0 }),
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], ScheduleEntity.prototype, "cancelled", void 0);
__decorate([
    (0, graphql_1.Field)(() => employees_entity_1.EmployeeEntity),
    (0, typeorm_1.ManyToOne)(() => employees_entity_1.EmployeeEntity, (entity) => entity.schedules, {
        eager: true,
    }),
    __metadata("design:type", employees_entity_1.EmployeeEntity)
], ScheduleEntity.prototype, "employee", void 0);
__decorate([
    (0, graphql_1.Field)(() => [services_entity_1.ServiceEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => services_entity_1.ServiceEntity, (entity) => entity.schedules, {
        eager: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], ScheduleEntity.prototype, "services", void 0);
__decorate([
    (0, graphql_1.Field)(() => [bookings_entity_1.BookingEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => bookings_entity_1.BookingEntity, (entity) => entity.schedules, {
        eager: true,
    }),
    __metadata("design:type", Array)
], ScheduleEntity.prototype, "bookings", void 0);
__decorate([
    (0, graphql_1.Field)(() => groups_entity_1.GroupsEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => groups_entity_1.GroupsEntity, (entity) => entity.schedules, {
        eager: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", groups_entity_1.GroupsEntity)
], ScheduleEntity.prototype, "group", void 0);
ScheduleEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('schedule'),
    __metadata("design:paramtypes", [])
], ScheduleEntity);
exports.ScheduleEntity = ScheduleEntity;
//# sourceMappingURL=schedules.entity.js.map