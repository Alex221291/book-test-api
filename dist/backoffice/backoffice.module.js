"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackofficeModule = void 0;
const nestjs_1 = require("@adminjs/nestjs");
const AdminJSTypeorm = require("@adminjs/typeorm");
const common_1 = require("@nestjs/common");
const adminjs_1 = require("adminjs");
const bookings_entity_1 = require("../common/bookings/bookings.entity");
const categories_entity_1 = require("../common/categories/categories.entity");
const companies_entity_1 = require("../common/companies/companies.entity");
const customer_entity_1 = require("../common/customers/customer.entity");
const employees_entity_1 = require("../common/employees/employees.entity");
const file_entity_1 = require("../common/file/file.entity");
const groups_entity_1 = require("../common/groups/groups.entity");
const integrations_entity_1 = require("../common/integrations/integrations.entity");
const offices_entity_1 = require("../common/offices/offices.entity");
const payments_entity_1 = require("../common/payments/payments.entity");
const plans_entity_1 = require("../common/plans/plans.entity");
const schedules_entity_1 = require("../common/schedules/schedules.entity");
const services_entity_1 = require("../common/services/services.entity");
const subscriptions_entity_1 = require("../common/subscriptions/subscriptions.entity");
const subscriptions_plan_entity_1 = require("../common/subscriptions/subscriptions.plan.entity");
const users_entity_1 = require("../common/users/users.entity");
const webform_entity_1 = require("../common/webforms/webform.entity");
adminjs_1.default.registerAdapter({
    Resource: AdminJSTypeorm.Resource,
    Database: AdminJSTypeorm.Database,
});
const DEFAULT_ADMIN = {
    email: 'stasik2015@yandex.ru',
    password: 'Ujpb&6?Dq{Oy]VRW@|XO8g/I',
};
const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
};
let BackofficeModule = class BackofficeModule {
};
BackofficeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_1.AdminModule.createAdminAsync({
                useFactory: () => {
                    return ({
                        adminJsOptions: {
                            rootPath: '/capmoxi',
                            loginPath: '/capmoxi/login',
                            logoutPath: '/capmoxi/logout',
                            resources: [
                                file_entity_1.FileEntity,
                                employees_entity_1.EmployeeEntity,
                                companies_entity_1.CompanyEntity,
                                users_entity_1.UserEntity,
                                customer_entity_1.CustomerEntity,
                                bookings_entity_1.BookingEntity,
                                schedules_entity_1.ScheduleEntity,
                                services_entity_1.ServiceEntity,
                                webform_entity_1.WebFormEntity,
                                offices_entity_1.OfficesEntity,
                                subscriptions_entity_1.SubscriptionsEntity,
                                categories_entity_1.CategoriesEntity,
                                subscriptions_plan_entity_1.SubscriptionsPlanEntity,
                                groups_entity_1.GroupsEntity,
                                integrations_entity_1.IntegrationsEntity,
                                plans_entity_1.PlansEntity,
                                payments_entity_1.PaymentsEntity,
                            ],
                        },
                        auth: {
                            authenticate,
                            cookieName: 'capmoxi',
                            cookiePassword: '~=/SxY!E3~.E&crz1aW_Bm.,',
                        },
                        sessionOptions: {
                            resave: true,
                            saveUninitialized: true,
                            secret: '~=/SxY!E3~.E&crz1aW_Bm.,',
                        },
                    });
                },
            }),
        ],
    })
], BackofficeModule);
exports.BackofficeModule = BackofficeModule;
//# sourceMappingURL=backoffice.module.js.map