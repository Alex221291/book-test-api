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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const employees_entity_1 = require("./employees.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let EmployeesService = class EmployeesService extends base_service_1.BaseService {
    constructor(repository) {
        super();
        this.repository = repository;
    }
    findAll(options) {
        return super.findAll(Object.assign({}, options));
    }
    getEmployeeById(id, company, serviceIds, userId) {
        const builder = this.repository.createQueryBuilder('e');
        builder
            .leftJoinAndSelect('e.office', 'office')
            .leftJoinAndSelect('e.services', 'services')
            .leftJoinAndSelect('office.company', 'company')
            .leftJoinAndSelect('company.users', 'users')
            .andWhere('company.hash = :hash', { hash: company })
            .andWhere(`e.id = :id`, { id });
        if (serviceIds) {
            builder.andWhere('services.id IN (:serviceIds)', { serviceIds });
        }
        if (userId) {
            builder.andWhere('users.id IN (:user)', { user: userId });
        }
        return builder.getOne();
    }
};
EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employees_entity_1.EmployeeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeesService);
exports.EmployeesService = EmployeesService;
//# sourceMappingURL=employees.service.js.map