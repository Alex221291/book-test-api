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
exports.CompanyEntity = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
const graphql_1 = require("@nestjs/graphql");
const services_entity_1 = require("../services/services.entity");
const customer_entity_1 = require("../customers/customer.entity");
const generateHash_1 = require("../../base/utils/generateHash");
const integrations_entity_1 = require("../integrations/integrations.entity");
const file_entity_1 = require("../file/file.entity");
const subscriptions_plan_entity_1 = require("../subscriptions/subscriptions.plan.entity");
const offices_entity_1 = require("../offices/offices.entity");
const categories_entity_1 = require("../categories/categories.entity");
const notifications_entity_1 = require("../notifications/notifications.entity");
const tags_entity_1 = require("../tags/tags.entity");
let CompanyEntity = class CompanyEntity extends typeorm_1.BaseEntity {
    constructor() {
        super();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.hash = (0, generateHash_1.default)();
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CompanyEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CompanyEntity.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CompanyEntity.prototype, "regNumber", void 0);
__decorate([
    (0, graphql_1.Field)(() => file_entity_1.FileEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => file_entity_1.FileEntity),
    __metadata("design:type", file_entity_1.FileEntity)
], CompanyEntity.prototype, "logo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CompanyEntity.prototype, "timezone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], CompanyEntity.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], CompanyEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => users_entity_1.UserEntity, (user) => user.companies),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => services_entity_1.ServiceEntity, (entity) => entity.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => categories_entity_1.CategoriesEntity, (entity) => entity.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => integrations_entity_1.IntegrationsEntity, (entity) => entity.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "integrations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subscriptions_plan_entity_1.SubscriptionsPlanEntity, (entity) => entity.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "subscriptionPlans", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => offices_entity_1.OfficesEntity, (entity) => entity.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "offices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_entity_1.CustomerEntity, (entity) => entity.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "customers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tags_entity_1.TagsEntity, (entity) => entity.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notifications_entity_1.NotificationsEntity, (entity) => entity.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "notifications", void 0);
CompanyEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('companies'),
    __metadata("design:paramtypes", [])
], CompanyEntity);
exports.CompanyEntity = CompanyEntity;
//# sourceMappingURL=companies.entity.js.map