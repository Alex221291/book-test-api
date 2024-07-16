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
exports.TagsEntity = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const customer_entity_1 = require("../customers/customer.entity");
const companies_entity_1 = require("../companies/companies.entity");
const services_entity_1 = require("../services/services.entity");
let TagsEntity = class TagsEntity extends typeorm_1.BaseEntity {
    constructor() {
        super();
        this.createdAt = new Date();
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TagsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TagsEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TagsEntity.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], TagsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [customer_entity_1.CustomerEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => customer_entity_1.CustomerEntity, (entity) => entity.tags),
    __metadata("design:type", Array)
], TagsEntity.prototype, "customers", void 0);
__decorate([
    (0, graphql_1.Field)(() => [services_entity_1.ServiceEntity], { nullable: true }),
    (0, typeorm_1.ManyToMany)(() => services_entity_1.ServiceEntity, (entity) => entity.tags),
    __metadata("design:type", Array)
], TagsEntity.prototype, "services", void 0);
__decorate([
    (0, graphql_1.Field)(() => companies_entity_1.CompanyEntity),
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.CompanyEntity, (entity) => entity.customers, { eager: true }),
    __metadata("design:type", companies_entity_1.CompanyEntity)
], TagsEntity.prototype, "company", void 0);
TagsEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('tags'),
    __metadata("design:paramtypes", [])
], TagsEntity);
exports.TagsEntity = TagsEntity;
//# sourceMappingURL=tags.entity.js.map