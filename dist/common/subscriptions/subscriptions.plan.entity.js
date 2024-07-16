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
exports.SubscriptionsPlanEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const services_entity_1 = require("../services/services.entity");
const companies_entity_1 = require("../companies/companies.entity");
const subscriptions_entity_1 = require("./subscriptions.entity");
const currency_enum_1 = require("../../base/types/currency.enum");
let SubscriptionsPlanEntity = class SubscriptionsPlanEntity extends typeorm_1.BaseEntity {
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
], SubscriptionsPlanEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SubscriptionsPlanEntity.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SubscriptionsPlanEntity.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)(() => currency_enum_1.CurrencyTypes),
    (0, typeorm_1.Column)({ length: 32 }),
    __metadata("design:type", String)
], SubscriptionsPlanEntity.prototype, "currency", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SubscriptionsPlanEntity.prototype, "validity", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 32 }),
    __metadata("design:type", String)
], SubscriptionsPlanEntity.prototype, "unit", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 64 }),
    __metadata("design:type", String)
], SubscriptionsPlanEntity.prototype, "activationType", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SubscriptionsPlanEntity.prototype, "visits", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SubscriptionsPlanEntity.prototype, "archived", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], SubscriptionsPlanEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], SubscriptionsPlanEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [services_entity_1.ServiceEntity]),
    (0, typeorm_1.ManyToMany)(() => services_entity_1.ServiceEntity, (entity) => entity.subscriptionPlans, {
        eager: true,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], SubscriptionsPlanEntity.prototype, "services", void 0);
__decorate([
    (0, graphql_1.Field)(() => companies_entity_1.CompanyEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.CompanyEntity, (entity) => entity.subscriptionPlans, {
        eager: true,
    }),
    __metadata("design:type", companies_entity_1.CompanyEntity)
], SubscriptionsPlanEntity.prototype, "company", void 0);
__decorate([
    (0, graphql_1.Field)(() => [subscriptions_entity_1.SubscriptionsEntity], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => subscriptions_entity_1.SubscriptionsEntity, (entity) => entity.plan),
    __metadata("design:type", Array)
], SubscriptionsPlanEntity.prototype, "subscriptions", void 0);
SubscriptionsPlanEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('subscription_plans'),
    __metadata("design:paramtypes", [])
], SubscriptionsPlanEntity);
exports.SubscriptionsPlanEntity = SubscriptionsPlanEntity;
//# sourceMappingURL=subscriptions.plan.entity.js.map