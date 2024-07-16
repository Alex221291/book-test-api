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
exports.SubscriptionsEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const subscriptions_plan_entity_1 = require("./subscriptions.plan.entity");
const customer_entity_1 = require("../customers/customer.entity");
const bookings_entity_1 = require("../bookings/bookings.entity");
const payments_entity_1 = require("../payments/payments.entity");
let SubscriptionsEntity = class SubscriptionsEntity extends typeorm_1.BaseEntity {
    constructor() {
        super();
        this.createdAt = new Date();
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SubscriptionsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], SubscriptionsEntity.prototype, "firstVisit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], SubscriptionsEntity.prototype, "sinceDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], SubscriptionsEntity.prototype, "untilDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], SubscriptionsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SubscriptionsEntity.prototype, "archived", void 0);
__decorate([
    (0, graphql_1.Field)(() => payments_entity_1.PaymentsEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => payments_entity_1.PaymentsEntity, (entity) => entity.subscriptions, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", payments_entity_1.PaymentsEntity)
], SubscriptionsEntity.prototype, "payment", void 0);
__decorate([
    (0, graphql_1.Field)(() => customer_entity_1.CustomerEntity),
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.CustomerEntity, (entity) => entity.subscriptions, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", customer_entity_1.CustomerEntity)
], SubscriptionsEntity.prototype, "customer", void 0);
__decorate([
    (0, graphql_1.Field)(() => subscriptions_plan_entity_1.SubscriptionsPlanEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => subscriptions_plan_entity_1.SubscriptionsPlanEntity, (entity) => entity.subscriptions, {
        eager: true,
    }),
    __metadata("design:type", subscriptions_plan_entity_1.SubscriptionsPlanEntity)
], SubscriptionsEntity.prototype, "plan", void 0);
__decorate([
    (0, graphql_1.Field)(() => [bookings_entity_1.BookingEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => bookings_entity_1.BookingEntity, (entity) => entity.subscription),
    __metadata("design:type", Array)
], SubscriptionsEntity.prototype, "bookings", void 0);
SubscriptionsEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('subscriptions'),
    __metadata("design:paramtypes", [])
], SubscriptionsEntity);
exports.SubscriptionsEntity = SubscriptionsEntity;
//# sourceMappingURL=subscriptions.entity.js.map