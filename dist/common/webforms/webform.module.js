"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebFormModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const companies_module_1 = require("../companies/companies.module");
const webform_service_1 = require("./webform.service");
const webform_entity_1 = require("./webform.entity");
const webform_resolver_1 = require("./webform.resolver");
const employees_module_1 = require("../employees/employees.module");
const offices_module_1 = require("../offices/offices.module");
const services_module_1 = require("../services/services.module");
let WebFormModule = class WebFormModule {
};
WebFormModule = __decorate([
    (0, common_1.Module)({
        imports: [
            companies_module_1.CompaniesModule,
            offices_module_1.OfficesModule,
            (0, common_1.forwardRef)(() => services_module_1.ServicesModule),
            (0, common_1.forwardRef)(() => employees_module_1.EmployeesModule),
            typeorm_1.TypeOrmModule.forFeature([webform_entity_1.WebFormEntity]),
        ],
        providers: [webform_service_1.WebFormService, webform_resolver_1.WebFormResolver],
        exports: [webform_service_1.WebFormService],
    })
], WebFormModule);
exports.WebFormModule = WebFormModule;
//# sourceMappingURL=webform.module.js.map