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
exports.GroupsCustomersEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const groups_entity_1 = require("./groups.entity");
const customer_entity_1 = require("../customers/customer.entity");
let GroupsCustomersEntity = class GroupsCustomersEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GroupsCustomersEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => groups_entity_1.GroupsEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => groups_entity_1.GroupsEntity, (entity) => entity.customers, {
        eager: true,
    }),
    __metadata("design:type", groups_entity_1.GroupsEntity)
], GroupsCustomersEntity.prototype, "group", void 0);
__decorate([
    (0, graphql_1.Field)(() => customer_entity_1.CustomerEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.CustomerEntity, (entity) => entity.groups, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", customer_entity_1.CustomerEntity)
], GroupsCustomersEntity.prototype, "customer", void 0);
GroupsCustomersEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('groups_customers')
], GroupsCustomersEntity);
exports.GroupsCustomersEntity = GroupsCustomersEntity;
//# sourceMappingURL=groups.customers.entity.js.map