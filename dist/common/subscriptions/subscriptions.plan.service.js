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
exports.SubscriptionsPlanService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const subscriptions_plan_entity_1 = require("./subscriptions.plan.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let SubscriptionsPlanService = class SubscriptionsPlanService extends base_service_1.BaseService {
    constructor(repository) {
        super();
        this.repository = repository;
    }
    async getSubscriptionsPlanById(userId, companyId, id) {
        const builder = this.repository.createQueryBuilder('e');
        builder
            .leftJoinAndSelect('e.company', 'company')
            .leftJoinAndSelect('e.services', 'service')
            .leftJoinAndSelect('company.users', 'users');
        builder
            .andWhere(`e.archived is FALSE`)
            .andWhere(`e.id = ${id}`)
            .andWhere(`users.id IN(${userId})`)
            .andWhere(`company.hash = '${companyId}'`);
        return await builder.getOne();
    }
};
SubscriptionsPlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriptions_plan_entity_1.SubscriptionsPlanEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubscriptionsPlanService);
exports.SubscriptionsPlanService = SubscriptionsPlanService;
//# sourceMappingURL=subscriptions.plan.service.js.map