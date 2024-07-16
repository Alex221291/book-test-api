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
exports.GroupsEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const schedules_entity_1 = require("../schedules/schedules.entity");
const services_entity_1 = require("../services/services.entity");
const offices_entity_1 = require("../offices/offices.entity");
const groups_customers_entity_1 = require("./groups.customers.entity");
let GroupsEntity = class GroupsEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GroupsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GroupsEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], GroupsEntity.prototype, "sinceDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], GroupsEntity.prototype, "untilDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], GroupsEntity.prototype, "archived", void 0);
__decorate([
    (0, graphql_1.Field)(() => services_entity_1.ServiceEntity),
    (0, typeorm_1.ManyToOne)(() => services_entity_1.ServiceEntity, (entity) => entity.groups),
    __metadata("design:type", services_entity_1.ServiceEntity)
], GroupsEntity.prototype, "service", void 0);
__decorate([
    (0, graphql_1.Field)(() => offices_entity_1.OfficesEntity),
    (0, typeorm_1.ManyToOne)(() => offices_entity_1.OfficesEntity, (entity) => entity.groups),
    __metadata("design:type", offices_entity_1.OfficesEntity)
], GroupsEntity.prototype, "office", void 0);
__decorate([
    (0, graphql_1.Field)(() => [groups_customers_entity_1.GroupsCustomersEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => groups_customers_entity_1.GroupsCustomersEntity, (entity) => entity.group),
    __metadata("design:type", Array)
], GroupsEntity.prototype, "customers", void 0);
__decorate([
    (0, graphql_1.Field)(() => [schedules_entity_1.ScheduleEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => schedules_entity_1.ScheduleEntity, (entity) => entity.group, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], GroupsEntity.prototype, "schedules", void 0);
GroupsEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('groups')
], GroupsEntity);
exports.GroupsEntity = GroupsEntity;
//# sourceMappingURL=groups.entity.js.map