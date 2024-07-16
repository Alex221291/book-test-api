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
var EmployeesResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const employees_service_1 = require("./employees.service");
const employees_entity_1 = require("./employees.entity");
const employees_input_1 = require("./employees.input");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const employees_paginate_1 = require("./types/employees.paginate");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const boooking_paginate_1 = require("../bookings/types/boooking.paginate");
const companies_service_1 = require("../companies/companies.service");
const services_service_1 = require("../services/services.service");
const file_service_1 = require("../file/file.service");
const rxjs_1 = require("rxjs");
const webform_service_1 = require("../webforms/webform.service");
const offices_service_1 = require("../offices/offices.service");
const parsePhoneNumber_1 = require("../../base/utils/parsePhoneNumber");
const users_role_enum_1 = require("../users/users.role.enum");
const users_status_enum_1 = require("../users/users.status.enum");
const generateRandomCode_1 = require("../../base/utils/generateRandomCode");
const event_emitter_1 = require("@nestjs/event-emitter");
const plans_services_1 = require("../plans/plans.services");
const notifications_service_1 = require("../notifications/notifications.service");
const telegram_service_1 = require("../integrations/messageServices/telegram/telegram.service");
let EmployeesResolver = EmployeesResolver_1 = class EmployeesResolver {
    constructor(service, companyService, servicesService, fileService, webFormService, officesService, plansService, eventEmitter, notificationsService, telegramSender) {
        this.service = service;
        this.companyService = companyService;
        this.servicesService = servicesService;
        this.fileService = fileService;
        this.webFormService = webFormService;
        this.officesService = officesService;
        this.plansService = plansService;
        this.eventEmitter = eventEmitter;
        this.notificationsService = notificationsService;
        this.telegramSender = telegramSender;
        this.logger = new common_1.Logger(EmployeesResolver_1.name);
    }
    async prepareEmployee(payload, employee, userId, companyHash) {
        const company = await this.companyService.findOneBy({
            users: {
                id: userId,
            },
            hash: companyHash,
        });
        if (company) {
            employee.firstName = payload.firstName;
            employee.lastName = payload.lastName;
            employee.phone = (0, parsePhoneNumber_1.default)(payload.phone);
            employee.jobTitle = payload.jobTitle;
            employee.rate = payload === null || payload === void 0 ? void 0 : payload.rate;
            if (payload.officeId) {
                employee.office = await this.officesService.findOneBy({
                    id: payload.officeId,
                    company: {
                        hash: companyHash,
                        users: {
                            id: userId,
                        },
                    },
                });
            }
            if (payload.photo) {
                employee.photo = await this.fileService.findOneBy({
                    filename: payload.photo,
                });
            }
            const services = [];
            if (payload === null || payload === void 0 ? void 0 : payload.services) {
                for (const serviceId of payload.services) {
                    services.push(await this.servicesService.findOneBy({
                        id: Number(serviceId),
                    }));
                }
            }
            return Object.assign(Object.assign({}, employee), { services });
        }
        else {
            throw new rxjs_1.NotFoundError('Company not found');
        }
    }
    async addEmployee(user, companyId, entity) {
        return this.service.add(await this.prepareEmployee(entity, new employees_entity_1.EmployeeEntity(), user.id, companyId));
    }
    async addEmployeePhoto(user, id, fileId) {
        const employee = await this.service.findOneBy({
            id,
            archived: false,
            office: {
                company: {
                    users: {
                        id: user.id,
                    },
                },
            },
        }, {
            photo: true,
            background: true,
        });
        if (employee) {
            const file = await this.fileService.findOneBy({
                id: fileId,
            });
            if (file) {
                employee.photo = file;
                return this.service.update(employee);
            }
            throw new common_1.NotFoundException('file.not.found');
        }
        throw new common_1.NotFoundException('employee.not.found');
    }
    async addEmployeeBackground(user, id, fileId) {
        const employee = await this.service.findOneBy({
            id,
            archived: false,
            office: {
                company: {
                    users: {
                        id: user.id,
                    },
                },
            },
        }, {
            photo: true,
            background: true,
        });
        if (employee) {
            const file = await this.fileService.findOneBy({
                id: fileId,
            });
            if (file) {
                employee.background = file;
                return this.service.update(employee);
            }
            throw new common_1.NotFoundException('file.not.found');
        }
        throw new common_1.NotFoundException('employee.not.found');
    }
    async updateEmployee(user, id, entity) {
        const employee = await this.service.findOneBy({
            id,
            archived: false,
            office: {
                company: {
                    users: {
                        id: user.id,
                    },
                },
            },
        });
        if (employee) {
            return this.service.update(await this.prepareEmployee(entity, employee, user.id, employee.office.company.hash));
        }
    }
    async setEmployeeAccess(user, id, phone, role) {
        const employee = await this.service.findOneBy({
            id,
            archived: false,
            office: {
                company: {
                    users: {
                        id: user.id,
                    },
                },
            },
        });
        if (employee) {
            if (!employee.user) {
                const plainPassword = (0, generateRandomCode_1.generateRandomCode)();
                try {
                    const message = `Password for ${phone} is ${plainPassword}`;
                    this.telegramSender.send(process.env.TELEGRAM_LOGS_TOKEN, process.env.TELEGRAM_LOGS_CHAT_ID, message);
                }
                catch (e) {
                    this.logger.warn(e.message);
                }
                const user = new users_entity_1.UserEntity(phone, plainPassword.toString());
                user.role = role;
                user.status = users_status_enum_1.UsersStatus.COMPLETED;
                user.companies = [employee.office.company];
                user.plan = await this.plansService.findOneBy({
                    code: 'FREE',
                });
                employee.user = user;
                return await this.service.update(employee).then((data) => {
                    this.notificationsService.sendSMS(user.phone, `https://app.bookform.by/\r
Vash parol dlya vhoda ${plainPassword}`);
                    return data;
                });
            }
            else {
                employee.user.phone = phone;
                employee.user.role = role;
            }
            return await this.service.update(employee);
        }
    }
    async removeEmployee(user, id) {
        const employee = await this.service.findOneBy({
            id,
            office: {
                company: {
                    users: {
                        id: user.id,
                    },
                },
            },
        });
        if (employee) {
            employee.archived = true;
            employee.user = null;
            employee.webForms = [];
            employee.services = [];
            return this.service.update(employee);
        }
        throw new common_1.NotFoundException('Something went wrong. Try again. :(');
    }
    async getEmployeeById(user, id) {
        return this.service.findOneBy({
            id: id,
            office: {
                company: {
                    users: {
                        id: user.id,
                    },
                },
            },
        }, {
            services: true,
            office: true,
            user: true,
            photo: true,
        });
    }
    async getEmployees(companyId, filters, sorters, offset, limit) {
        const builder = this.service.findWithQueryBuilder(filters, sorters, offset, limit);
        builder
            .leftJoinAndSelect('e.photo', 'photo')
            .leftJoinAndSelect('e.user', 'user')
            .leftJoinAndSelect('e.services', 'service')
            .leftJoinAndSelect('e.office', 'office')
            .leftJoinAndSelect('office.company', 'company')
            .leftJoinAndSelect('company.users', 'users')
            .andWhere(`company.hash = '${companyId}'`);
        const [data, count] = await builder.getManyAndCount();
        return new boooking_paginate_1.default(data, count, offset, limit);
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => employees_entity_1.EmployeeEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('company')),
    __param(2, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, employees_input_1.EmployeeInput]),
    __metadata("design:returntype", Promise)
], EmployeesResolver.prototype, "addEmployee", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => employees_entity_1.EmployeeEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('fileId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, Number]),
    __metadata("design:returntype", Promise)
], EmployeesResolver.prototype, "addEmployeePhoto", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => employees_entity_1.EmployeeEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('fileId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, Number]),
    __metadata("design:returntype", Promise)
], EmployeesResolver.prototype, "addEmployeeBackground", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => employees_entity_1.EmployeeEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('entity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, employees_input_1.EmployeeInput]),
    __metadata("design:returntype", Promise)
], EmployeesResolver.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => employees_entity_1.EmployeeEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('phone')),
    __param(3, (0, graphql_1.Args)('role', { type: () => users_role_enum_1.RoleTypes })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, String, String]),
    __metadata("design:returntype", Promise)
], EmployeesResolver.prototype, "setEmployeeAccess", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => employees_entity_1.EmployeeEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], EmployeesResolver.prototype, "removeEmployee", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => employees_entity_1.EmployeeEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], EmployeesResolver.prototype, "getEmployeeById", null);
__decorate([
    (0, graphql_1.Query)(() => employees_paginate_1.default),
    __param(0, (0, graphql_1.Args)('company')),
    __param(1, (0, graphql_1.Args)('filters', {
        nullable: true,
        defaultValue: [{ operator: 'AND', filters: [] }],
        type: () => [filters_type_1.default],
    })),
    __param(2, (0, graphql_1.Args)('sorters', { nullable: true, type: () => [sorter_type_1.default] })),
    __param(3, (0, graphql_1.Args)('offset', { type: () => graphql_1.Int, nullable: true })),
    __param(4, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Array, Number, Number]),
    __metadata("design:returntype", Promise)
], EmployeesResolver.prototype, "getEmployees", null);
EmployeesResolver = EmployeesResolver_1 = __decorate([
    (0, graphql_1.Resolver)(() => EmployeesResolver_1),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService,
        companies_service_1.CompaniesService,
        services_service_1.ServicesService,
        file_service_1.FileService,
        webform_service_1.WebFormService,
        offices_service_1.OfficesService,
        plans_services_1.PlansService,
        event_emitter_1.EventEmitter2,
        notifications_service_1.NotificationsService,
        telegram_service_1.TelegramService])
], EmployeesResolver);
exports.EmployeesResolver = EmployeesResolver;
//# sourceMappingURL=employees.resolver.js.map