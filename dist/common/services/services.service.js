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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const services_entity_1 = require("./services.entity");
const typeorm_2 = require("typeorm");
const base_service_1 = require("../../base/base.service");
const categories_entity_1 = require("../categories/categories.entity");
const categories_service_1 = require("../categories/categories.service");
const tags_service_1 = require("../tags/tags.service");
let ServicesService = class ServicesService extends base_service_1.BaseService {
    constructor(repository, categoriesService, tagsService) {
        super();
        this.repository = repository;
        this.categoriesService = categoriesService;
        this.tagsService = tagsService;
    }
    async prepare(payload, entity, company) {
        entity.title = payload.title;
        entity.description = payload.description;
        entity.duration = payload.duration;
        entity.price = payload.price;
        entity.currency = payload.currency;
        entity.company = company;
        entity.maxPrice = payload.maxPrice;
        entity.weight = payload.weight;
        if (payload.category) {
            entity.category = await this.categoriesService.findOneBy({
                title: payload.category.toLowerCase(),
                company: {
                    hash: company.hash,
                },
            });
            if (!entity.category) {
                const category = new categories_entity_1.CategoriesEntity();
                category.title = payload.category.toLowerCase();
                category.company = company;
                entity.category = category;
            }
        }
        else {
            entity.category = null;
        }
        return entity;
    }
    async getService(where, userId) {
        return await this.findOneBy(Object.assign(Object.assign({}, where), { company: {
                users: {
                    id: userId,
                },
            } }), {
            tags: true,
        });
    }
    findAll(options) {
        return super.findAll(Object.assign({}, options));
    }
    findServicesByIds(employeeIds, serviceIds) {
        const builder = this.repository.createQueryBuilder('e');
        builder
            .leftJoin('e.company', 'company')
            .leftJoinAndSelect('e.employees', 'employees')
            .andWhere(`e.id IN(:serviceIds)`, { serviceIds });
        builder.andWhere(new typeorm_2.Brackets((qb) => {
            for (const id of employeeIds) {
                qb.andWhere(`employees.id = ${id}`);
            }
        }));
        builder.groupBy('e.id');
        return builder.getMany();
    }
    async addTag(serviceId, tagId, userId) {
        const entity = await this.getService({ id: serviceId }, userId);
        const tag = await this.tagsService.getTag(tagId, userId);
        if (entity) {
            if (tag) {
                entity.tags = [...entity.tags, tag];
                return this.repository.save(entity);
            }
            throw new common_1.NotFoundException('tag.not.found');
        }
        throw new common_1.NotFoundException('service.not.found');
    }
    async removeTag(serviceId, tagId, userId) {
        const entity = await this.getService({ id: serviceId }, userId);
        if (entity) {
            entity.tags = entity.tags.filter(({ id }) => id !== tagId);
            return this.repository.save(entity);
        }
        throw new common_1.NotFoundException('service.not.found');
    }
};
ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(services_entity_1.ServiceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categories_service_1.CategoriesService,
        tags_service_1.TagsService])
], ServicesService);
exports.ServicesService = ServicesService;
//# sourceMappingURL=services.service.js.map