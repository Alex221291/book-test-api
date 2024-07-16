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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const base_entity_1 = require("./base.entity");
class BaseResolver {
    constructor(service) {
        this.service = service;
    }
    async add(entity) {
        return this.service.add(entity);
    }
    async update(entity) {
        return this.service.update(entity);
    }
    async remove(id) {
        return this.service.remove(id);
    }
    async getAll() {
        return this.service.findAll();
    }
}
__decorate([
    (0, graphql_1.Mutation)(() => {
        return base_entity_1.BaseEntity;
    }, { name: 'addMutation' }),
    __param(0, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_entity_1.BaseEntity]),
    __metadata("design:returntype", Promise)
], BaseResolver.prototype, "add", null);
__decorate([
    (0, graphql_1.Mutation)(() => base_entity_1.BaseEntity),
    __param(0, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_entity_1.BaseEntity]),
    __metadata("design:returntype", Promise)
], BaseResolver.prototype, "update", null);
__decorate([
    (0, graphql_1.Mutation)(() => base_entity_1.BaseEntity),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BaseResolver.prototype, "remove", null);
__decorate([
    (0, graphql_1.Query)(() => [(base_entity_1.BaseEntity)], { name: 'getQuery' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseResolver.prototype, "getAll", null);
exports.BaseResolver = BaseResolver;
//# sourceMappingURL=base.resolver.js.map