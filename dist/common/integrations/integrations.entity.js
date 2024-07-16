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
exports.IntegrationsEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const companies_entity_1 = require("../companies/companies.entity");
const integrations_type_1 = require("./integrations.type");
const integrations_provider_type_1 = require("./integrations.provider.type");
let IntegrationsEntity = class IntegrationsEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], IntegrationsEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => integrations_type_1.IntegrationsType),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IntegrationsEntity.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => integrations_provider_type_1.IntegrationsProviderType),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IntegrationsEntity.prototype, "provider", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], IntegrationsEntity.prototype, "config", void 0);
__decorate([
    (0, graphql_1.Field)(() => companies_entity_1.CompanyEntity),
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.CompanyEntity, (entity) => entity.integrations, {
        eager: true,
    }),
    __metadata("design:type", companies_entity_1.CompanyEntity)
], IntegrationsEntity.prototype, "company", void 0);
IntegrationsEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('integrations')
], IntegrationsEntity);
exports.IntegrationsEntity = IntegrationsEntity;
//# sourceMappingURL=integrations.entity.js.map