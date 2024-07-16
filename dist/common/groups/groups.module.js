"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const groups_entity_1 = require("./groups.entity");
const groups_service_1 = require("./groups.service");
const groups_resolver_1 = require("./groups.resolver");
const companies_module_1 = require("../companies/companies.module");
const services_module_1 = require("../services/services.module");
const offices_module_1 = require("../offices/offices.module");
const groups_customers_entity_1 = require("./groups.customers.entity");
const groups_customers_service_1 = require("./groups.customers.service");
const groups_customers_resolver_1 = require("./groups.customers.resolver");
const customer_module_1 = require("../customers/customer.module");
const groups_cron_1 = require("./groups.cron");
const schedules_module_1 = require("../schedules/schedules.module");
const bookings_module_1 = require("../bookings/bookings.module");
const notifications_module_1 = require("../notifications/notifications.module");
let GroupsModule = class GroupsModule {
};
GroupsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            companies_module_1.CompaniesModule,
            (0, common_1.forwardRef)(() => services_module_1.ServicesModule),
            offices_module_1.OfficesModule,
            bookings_module_1.BookingsModule,
            notifications_module_1.NotificationsModule,
            (0, common_1.forwardRef)(() => schedules_module_1.SchedulesModule),
            (0, common_1.forwardRef)(() => customer_module_1.CustomerModule),
            typeorm_1.TypeOrmModule.forFeature([groups_entity_1.GroupsEntity, groups_customers_entity_1.GroupsCustomersEntity]),
        ],
        providers: [
            groups_service_1.GroupsService,
            groups_resolver_1.GroupsResolver,
            groups_customers_service_1.GroupsCustomersService,
            groups_customers_resolver_1.GroupsCustomersResolver,
            groups_cron_1.GroupsCron,
        ],
        exports: [groups_service_1.GroupsService, groups_customers_service_1.GroupsCustomersService],
    })
], GroupsModule);
exports.GroupsModule = GroupsModule;
//# sourceMappingURL=groups.module.js.map