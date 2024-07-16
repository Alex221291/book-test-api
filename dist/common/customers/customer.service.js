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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const customer_entity_1 = require("./customer.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tags_service_1 = require("../tags/tags.service");
const customer_paginate_1 = require("./types/customer.paginate");
const class_transformer_1 = require("class-transformer");
let CustomerService = class CustomerService extends base_service_1.BaseService {
    constructor(repository, tagsService) {
        super();
        this.repository = repository;
        this.tagsService = tagsService;
    }
    prepare(entity, payload, company) {
        return this.repository.merge(entity, Object.assign(Object.assign({}, payload), { company }));
    }
    async getCustomers(filters = [{ operator: 'AND', filters: [] }], sorters = [], companyId, user, offset = 0, limit = null) {
        const builder = this.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.company', 'company')
            .leftJoinAndSelect('company.users', 'users')
            .leftJoinAndSelect('e.bookings', 'bookings')
            .leftJoinAndSelect('e.tags', 'tags')
            .andWhere(`users.id IN(:userIds)`, { userIds: [user.id] })
            .andWhere(`company.hash = :companyId`, { companyId })
            .andWhere('e.archived = :archived', { archived: false });
        const [data, count] = await builder.getManyAndCount();
        return new customer_paginate_1.default((0, class_transformer_1.classToPlain)(data, { groups: [user.role] }), count, offset, limit);
    }
    async getCustomer(where, userId) {
        return await this.findOneBy(Object.assign(Object.assign({}, where), { archived: false, company: {
                users: {
                    id: userId,
                },
            } }), {
            bookings: true,
            tags: true,
        });
    }
    async addTag(customerId, tagId, userId) {
        const entity = await this.getCustomer({ id: customerId }, userId);
        const tag = await this.tagsService.getTag(tagId, userId);
        if (entity) {
            if (tag) {
                entity.tags = [...entity.tags, tag];
                return this.repository.save(entity);
            }
            throw new common_1.NotFoundException('tag.not.found');
        }
        throw new common_1.NotFoundException('customer.not.found');
    }
    async removeTag(customerId, tagId, userId) {
        const entity = await this.getCustomer({ id: customerId }, userId);
        if (entity) {
            entity.tags = entity.tags.filter(({ id }) => id !== tagId);
            return this.repository.save(entity);
        }
        throw new common_1.NotFoundException('customer.not.found');
    }
};
CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.CustomerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tags_service_1.TagsService])
], CustomerService);
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map