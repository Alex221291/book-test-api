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
exports.PaymentsEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
const bookings_entity_1 = require("../bookings/bookings.entity");
const subscriptions_entity_1 = require("../subscriptions/subscriptions.entity");
let PaymentsEntity = class PaymentsEntity extends typeorm_1.BaseEntity {
    constructor() {
        super();
        this.createdAt = new Date();
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentsEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentsEntity.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentsEntity.prototype, "account_key", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentsEntity.prototype, "purpose", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentsEntity.prototype, "details", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentsEntity.prototype, "amount", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentsEntity.prototype, "currency", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: '1' }),
    __metadata("design:type", String)
], PaymentsEntity.prototype, "conversionRate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentsEntity.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentsEntity.prototype, "balance", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], PaymentsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => users_entity_1.UserEntity),
    (0, typeorm_1.ManyToOne)(() => users_entity_1.UserEntity, (entity) => entity.payments),
    __metadata("design:type", users_entity_1.UserEntity)
], PaymentsEntity.prototype, "user", void 0);
__decorate([
    (0, graphql_1.Field)(() => [bookings_entity_1.BookingEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => bookings_entity_1.BookingEntity, (entity) => entity.payment),
    __metadata("design:type", Array)
], PaymentsEntity.prototype, "bookings", void 0);
__decorate([
    (0, graphql_1.Field)(() => [subscriptions_entity_1.SubscriptionsEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => subscriptions_entity_1.SubscriptionsEntity, (entity) => entity.payment),
    __metadata("design:type", Array)
], PaymentsEntity.prototype, "subscriptions", void 0);
PaymentsEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('payments'),
    __metadata("design:paramtypes", [])
], PaymentsEntity);
exports.PaymentsEntity = PaymentsEntity;
//# sourceMappingURL=payments.entity.js.map