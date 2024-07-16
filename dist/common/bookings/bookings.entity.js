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
exports.BookingEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const schedules_entity_1 = require("../schedules/schedules.entity");
const customer_entity_1 = require("../customers/customer.entity");
const generateHash_1 = require("../../base/utils/generateHash");
const generateRandomCode_1 = require("../../base/utils/generateRandomCode");
const offices_entity_1 = require("../offices/offices.entity");
const currency_enum_1 = require("../../base/types/currency.enum");
const bookings_statuses_1 = require("./types/bookings.statuses");
const subscriptions_entity_1 = require("../subscriptions/subscriptions.entity");
const webform_entity_1 = require("../webforms/webform.entity");
const payments_entity_1 = require("../payments/payments.entity");
let BookingEntity = class BookingEntity extends typeorm_1.BaseEntity {
    constructor() {
        super();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.hash = (0, generateHash_1.default)();
        this.code = (0, generateRandomCode_1.generateRandomCode)().toString();
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BookingEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BookingEntity.prototype, "hash", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BookingEntity.prototype, "confirmed", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BookingEntity.prototype, "code", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ default: 0, nullable: true }),
    __metadata("design:type", Number)
], BookingEntity.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)(() => payments_entity_1.PaymentsEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => payments_entity_1.PaymentsEntity, (entity) => entity.bookings, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", payments_entity_1.PaymentsEntity)
], BookingEntity.prototype, "payment", void 0);
__decorate([
    (0, graphql_1.Field)(() => bookings_statuses_1.BookingsStatuses),
    (0, typeorm_1.Column)({ length: 32, default: bookings_statuses_1.BookingsStatuses.PREPARED }),
    __metadata("design:type", String)
], BookingEntity.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => currency_enum_1.CurrencyTypes),
    (0, typeorm_1.Column)({ length: 32, default: currency_enum_1.CurrencyTypes.BYN }),
    __metadata("design:type", String)
], BookingEntity.prototype, "currency", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', default: null, length: 10485760 }),
    __metadata("design:type", String)
], BookingEntity.prototype, "comment", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], BookingEntity.prototype, "remindFor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ default: false, nullable: true }),
    __metadata("design:type", Boolean)
], BookingEntity.prototype, "remindSent", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BookingEntity.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.UpdateDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], BookingEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [schedules_entity_1.ScheduleEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => schedules_entity_1.ScheduleEntity, (entity) => entity.bookings, {
        cascade: true,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], BookingEntity.prototype, "schedules", void 0);
__decorate([
    (0, graphql_1.Field)(() => offices_entity_1.OfficesEntity),
    (0, typeorm_1.ManyToOne)(() => offices_entity_1.OfficesEntity, (entity) => entity.bookings),
    __metadata("design:type", offices_entity_1.OfficesEntity)
], BookingEntity.prototype, "office", void 0);
__decorate([
    (0, graphql_1.Field)(() => webform_entity_1.WebFormEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => webform_entity_1.WebFormEntity, (entity) => entity.bookings),
    __metadata("design:type", webform_entity_1.WebFormEntity)
], BookingEntity.prototype, "webForm", void 0);
__decorate([
    (0, graphql_1.Field)(() => subscriptions_entity_1.SubscriptionsEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => subscriptions_entity_1.SubscriptionsEntity, (entity) => entity.bookings, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", subscriptions_entity_1.SubscriptionsEntity)
], BookingEntity.prototype, "subscription", void 0);
__decorate([
    (0, graphql_1.Field)(() => customer_entity_1.CustomerEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.CustomerEntity, (entity) => entity.bookings, {
        eager: true,
        cascade: true,
        nullable: true,
    }),
    __metadata("design:type", customer_entity_1.CustomerEntity)
], BookingEntity.prototype, "customer", void 0);
BookingEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('bookings'),
    __metadata("design:paramtypes", [])
], BookingEntity);
exports.BookingEntity = BookingEntity;
//# sourceMappingURL=bookings.entity.js.map