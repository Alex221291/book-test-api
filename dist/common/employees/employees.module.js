"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesModule = void 0;
const common_1 = require("@nestjs/common");
const employees_service_1 = require("./employees.service");
const typeorm_1 = require("@nestjs/typeorm");
const employees_entity_1 = require("./employees.entity");
const employees_resolver_1 = require("./employees.resolver");
const companies_module_1 = require("../companies/companies.module");
const services_module_1 = require("../services/services.module");
const file_module_1 = require("../file/file.module");
const webform_module_1 = require("../webforms/webform.module");
const offices_module_1 = require("../offices/offices.module");
const plans_module_1 = require("../plans/plans.module");
const notifications_module_1 = require("../notifications/notifications.module");
let EmployeesModule = class EmployeesModule {
};
EmployeesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            companies_module_1.CompaniesModule,
            (0, common_1.forwardRef)(() => services_module_1.ServicesModule),
            offices_module_1.OfficesModule,
            file_module_1.FileModule,
            plans_module_1.PlansModule,
            (0, common_1.forwardRef)(() => webform_module_1.WebFormModule),
            typeorm_1.TypeOrmModule.forFeature([employees_entity_1.EmployeeEntity]),
            notifications_module_1.NotificationsModule,
        ],
        providers: [employees_service_1.EmployeesService, employees_resolver_1.EmployeesResolver],
        exports: [employees_service_1.EmployeesService],
    })
], EmployeesModule);
exports.EmployeesModule = EmployeesModule;
//# sourceMappingURL=employees.module.js.map