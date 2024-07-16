"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const integrations_entity_1 = require("./integrations.entity");
const integrations_service_1 = require("./integrations.service");
const integrations_resolver_1 = require("./integrations.resolver");
const companies_module_1 = require("../companies/companies.module");
const axios_1 = require("@nestjs/axios");
const notifications_module_1 = require("../notifications/notifications.module");
let IntegrationsModule = class IntegrationsModule {
};
IntegrationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            companies_module_1.CompaniesModule,
            typeorm_1.TypeOrmModule.forFeature([integrations_entity_1.IntegrationsEntity]),
            axios_1.HttpModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [integrations_service_1.IntegrationsService, integrations_resolver_1.IntegrationsResolver],
        exports: [integrations_service_1.IntegrationsService],
    })
], IntegrationsModule);
exports.IntegrationsModule = IntegrationsModule;
//# sourceMappingURL=integrations.module.js.map