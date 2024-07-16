"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesModule = void 0;
const common_1 = require("@nestjs/common");
const services_service_1 = require("./services.service");
const services_resolver_1 = require("./services.resolver");
const typeorm_1 = require("@nestjs/typeorm");
const services_entity_1 = require("./services.entity");
const companies_module_1 = require("../companies/companies.module");
const categories_module_1 = require("../categories/categories.module");
const tags_module_1 = require("../tags/tags.module");
let ServicesModule = class ServicesModule {
};
ServicesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            companies_module_1.CompaniesModule,
            categories_module_1.CategoriesModule,
            tags_module_1.TagsModule,
            typeorm_1.TypeOrmModule.forFeature([services_entity_1.ServiceEntity]),
        ],
        providers: [services_service_1.ServicesService, services_resolver_1.ServicesResolver],
        exports: [services_service_1.ServicesService],
    })
], ServicesModule);
exports.ServicesModule = ServicesModule;
//# sourceMappingURL=services.module.js.map