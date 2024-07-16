"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./common/users/users.module");
const auth_module_1 = require("./auth/auth.module");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const companies_module_1 = require("./common/companies/companies.module");
const services_module_1 = require("./common/services/services.module");
const employees_module_1 = require("./common/employees/employees.module");
const schedules_module_1 = require("./common/schedules/schedules.module");
const bookings_module_1 = require("./common/bookings/bookings.module");
const customer_module_1 = require("./common/customers/customer.module");
const file_module_1 = require("./common/file/file.module");
const config_1 = require("@nestjs/config");
const analytics_module_1 = require("./common/analytics/analytics.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const integrations_module_1 = require("./common/integrations/integrations.module");
const webform_module_1 = require("./common/webforms/webform.module");
const backoffice_module_1 = require("./backoffice/backoffice.module");
const notifications_module_1 = require("./common/notifications/notifications.module");
const nestjs_i18n_1 = require("nestjs-i18n");
const subscriptions_module_1 = require("./common/subscriptions/subscriptions.module");
const groups_module_1 = require("./common/groups/groups.module");
const schedule_1 = require("@nestjs/schedule");
const offices_module_1 = require("./common/offices/offices.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_gql_throttler_guard_1 = require("./app.gql-throttler.guard");
const typeorm_1 = require("@nestjs/typeorm");
const categories_module_1 = require("./common/categories/categories.module");
const plans_module_1 = require("./common/plans/plans.module");
const payments_module_1 = require("./common/payments/payments.module");
const tags_module_1 = require("./common/tags/tags.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot({
                ttl: 30,
                limit: 30,
            }),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.prod', '.env.dev', '.env.default'],
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                debug: process.env.NODE_ENV === 'development',
                playground: process.env.NODE_ENV === 'development',
                autoSchemaFile: true,
                cache: 'bounded',
                subscriptions: {
                    'graphql-ws': true,
                    'subscriptions-transport-ws': true,
                },
                context: (ctx) => ctx,
            }),
            nestjs_i18n_1.I18nModule.forRoot({
                fallbackLanguage: 'ru',
                loaderOptions: {
                    path: __dirname + '/i18n/',
                    watch: true,
                },
                resolvers: [nestjs_i18n_1.AcceptLanguageResolver],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    url: process.env.DATABASE_URL,
                    ssl: true,
                    entities: ['dist/**/*.entity{.ts,.js}'],
                    migrations: ['dist/migrations/*{.ts,.js}'],
                    synchronize: true,
                }),
            }),
            backoffice_module_1.BackofficeModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
            services_module_1.ServicesModule,
            employees_module_1.EmployeesModule,
            webform_module_1.WebFormModule,
            bookings_module_1.BookingsModule,
            schedules_module_1.SchedulesModule,
            customer_module_1.CustomerModule,
            file_module_1.FileModule,
            analytics_module_1.AnalyticsModule,
            integrations_module_1.IntegrationsModule,
            notifications_module_1.NotificationsModule,
            subscriptions_module_1.SubscriptionsModule,
            groups_module_1.GroupsModule,
            offices_module_1.OfficesModule,
            categories_module_1.CategoriesModule,
            plans_module_1.PlansModule,
            payments_module_1.PaymentsModule,
            tags_module_1.TagsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: app_gql_throttler_guard_1.GqlThrottlerGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map