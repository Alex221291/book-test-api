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
exports.WebFormService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const webform_entity_1 = require("./webform.entity");
const offices_service_1 = require("../offices/offices.service");
const employees_service_1 = require("../employees/employees.service");
const services_service_1 = require("../services/services.service");
const webform_paginate_1 = require("./types/webform.paginate");
let WebFormService = class WebFormService extends base_service_1.BaseService {
    constructor(repository, officesService, employeesService, servicesService) {
        super();
        this.repository = repository;
        this.officesService = officesService;
        this.employeesService = employeesService;
        this.servicesService = servicesService;
    }
    async prepare(entity, payload, userId) {
        const webFormEntity = this.repository.merge(entity, payload);
        webFormEntity.office = await this.officesService.findOneBy({
            id: payload.officeId,
            company: {
                users: {
                    id: userId,
                },
            },
        });
        webFormEntity.employees = await Promise.all(payload.employeeIds.map(async (id) => this.employeesService.findOneBy({
            id,
            office: {
                company: {
                    users: {
                        id: userId,
                    },
                },
            },
        })));
        webFormEntity.services = await Promise.all(payload.serviceIds.map(async (id) => this.servicesService.findOneBy({
            id,
            company: {
                users: {
                    id: userId,
                },
            },
        })));
        return webFormEntity;
    }
    async getWebFormList(userIds, companyId, filters, sorters, offset, limit) {
        const builder = this.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.office', 'office')
            .leftJoinAndSelect('office.company', 'company')
            .leftJoinAndSelect('company.users', 'users')
            .andWhere('e.archived is FALSE')
            .andWhere(`company.hash = :companyId`, { companyId })
            .andWhere(`users.id IN(:userIds)`, { userIds });
        const [data, count] = await builder.getManyAndCount();
        return new webform_paginate_1.default(data, count, offset, limit);
    }
    async getWebFormByHash(hash) {
        const entity = await this.findOneBy({
            hash,
            archived: false,
        }, {
            office: {
                company: {
                    logo: true,
                },
            },
            services: true,
            employees: {
                photo: true,
            },
        });
        if (!entity) {
            throw new common_1.NotFoundException('entity.not.found');
        }
        return entity;
    }
    async getWebForm(where, user) {
        const entity = await this.findOneBy(Object.assign(Object.assign({}, where), { archived: false, office: {
                company: {
                    users: {
                        id: user.id,
                    },
                },
            } }), {
            office: {
                company: {
                    logo: true,
                },
            },
            services: true,
            employees: true,
        });
        if (!entity) {
            throw new common_1.NotFoundException('entity.not.found');
        }
        return entity;
    }
};
WebFormService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(webform_entity_1.WebFormEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        offices_service_1.OfficesService,
        employees_service_1.EmployeesService,
        services_service_1.ServicesService])
], WebFormService);
exports.WebFormService = WebFormService;
//# sourceMappingURL=webform.service.js.map