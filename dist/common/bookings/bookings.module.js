"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const typeorm_1 = require("@nestjs/typeorm");
const bookings_entity_1 = require("./bookings.entity");
const bookings_resolver_1 = require("./bookings.resolver");
const customer_module_1 = require("../customers/customer.module");
const schedules_module_1 = require("../schedules/schedules.module");
const services_module_1 = require("../services/services.module");
const companies_module_1 = require("../companies/companies.module");
const bookings_event_1 = require("./bookings.event");
const integrations_module_1 = require("../integrations/integrations.module");
const employees_module_1 = require("../employees/employees.module");
const offices_module_1 = require("../offices/offices.module");
const subscriptions_module_1 = require("../subscriptions/subscriptions.module");
const notifications_module_1 = require("../notifications/notifications.module");
const webform_module_1 = require("../webforms/webform.module");
const payments_module_1 = require("../payments/payments.module");
const users_module_1 = require("../users/users.module");
const bookings_cron_1 = require("./bookings.cron");
let BookingsModule = class BookingsModule {
};
BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => customer_module_1.CustomerModule),
            (0, common_1.forwardRef)(() => schedules_module_1.SchedulesModule),
            (0, common_1.forwardRef)(() => services_module_1.ServicesModule),
            companies_module_1.CompaniesModule,
            offices_module_1.OfficesModule,
            employees_module_1.EmployeesModule,
            integrations_module_1.IntegrationsModule,
            notifications_module_1.NotificationsModule,
            webform_module_1.WebFormModule,
            payments_module_1.PaymentsModule,
            users_module_1.UsersModule,
            (0, common_1.forwardRef)(() => subscriptions_module_1.SubscriptionsModule),
            typeorm_1.TypeOrmModule.forFeature([bookings_entity_1.BookingEntity]),
        ],
        providers: [bookings_service_1.BookingsService, bookings_resolver_1.BookingsResolver, bookings_event_1.BookingEvents, bookings_cron_1.BookingsCron],
        exports: [bookings_service_1.BookingsService],
    })
], BookingsModule);
exports.BookingsModule = BookingsModule;
//# sourceMappingURL=bookings.module.js.map