"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModule = void 0;
const common_1 = require("@nestjs/common");
const customer_service_1 = require("./customer.service");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./customer.entity");
const customer_resolver_1 = require("./customer.resolver");
const groups_module_1 = require("../groups/groups.module");
const companies_module_1 = require("../companies/companies.module");
const tags_module_1 = require("../tags/tags.module");
let CustomerModule = class CustomerModule {
};
CustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            companies_module_1.CompaniesModule,
            (0, common_1.forwardRef)(() => tags_module_1.TagsModule),
            (0, common_1.forwardRef)(() => groups_module_1.GroupsModule),
            typeorm_1.TypeOrmModule.forFeature([customer_entity_1.CustomerEntity]),
        ],
        providers: [customer_service_1.CustomerService, customer_resolver_1.CustomerResolver],
        exports: [customer_service_1.CustomerService],
    })
], CustomerModule);
exports.CustomerModule = CustomerModule;
//# sourceMappingURL=customer.module.js.map