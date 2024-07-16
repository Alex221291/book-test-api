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
exports.NotificationsEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const companies_entity_1 = require("../companies/companies.entity");
let NotificationsEntity = class NotificationsEntity extends typeorm_1.BaseEntity {
    constructor() {
        super();
        this.createdAt = new Date();
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NotificationsEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationsEntity.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationsEntity.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NotificationsEntity.prototype, "read", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationsEntity.prototype, "json", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], NotificationsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => companies_entity_1.CompanyEntity),
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.CompanyEntity, (entity) => entity.notifications, {
        eager: true,
    }),
    __metadata("design:type", companies_entity_1.CompanyEntity)
], NotificationsEntity.prototype, "company", void 0);
NotificationsEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('notifications'),
    __metadata("design:paramtypes", [])
], NotificationsEntity);
exports.NotificationsEntity = NotificationsEntity;
//# sourceMappingURL=notifications.entity.js.map