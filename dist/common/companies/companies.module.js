"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesModule = void 0;
const common_1 = require("@nestjs/common");
const companies_service_1 = require("./companies.service");
const typeorm_1 = require("@nestjs/typeorm");
const companies_entity_1 = require("./companies.entity");
const companies_resolver_1 = require("./companies.resolver");
const file_module_1 = require("../file/file.module");
let CompaniesModule = class CompaniesModule {
};
CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([companies_entity_1.CompanyEntity]), file_module_1.FileModule],
        providers: [companies_service_1.CompaniesService, companies_resolver_1.CompaniesResolver],
        exports: [companies_service_1.CompaniesService],
    })
], CompaniesModule);
exports.CompaniesModule = CompaniesModule;
//# sourceMappingURL=companies.module.js.map