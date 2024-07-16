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
exports.PlansEntity = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const currency_enum_1 = require("../../base/types/currency.enum");
const users_entity_1 = require("../users/users.entity");
let PlansEntity = class PlansEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PlansEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlansEntity.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlansEntity.prototype, "code", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], PlansEntity.prototype, "level", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PlansEntity.prototype, "ordersLimit", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], PlansEntity.prototype, "profit", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], PlansEntity.prototype, "superProfit", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 32, default: currency_enum_1.CurrencyTypes.BYN }),
    __metadata("design:type", String)
], PlansEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => users_entity_1.UserEntity, (entity) => entity.plan),
    __metadata("design:type", Array)
], PlansEntity.prototype, "users", void 0);
PlansEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('plans')
], PlansEntity);
exports.PlansEntity = PlansEntity;
//# sourceMappingURL=plans.entity.js.map