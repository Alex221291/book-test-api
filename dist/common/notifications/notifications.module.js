"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_event_1 = require("./notifications.event");
const typeorm_1 = require("@nestjs/typeorm");
const notifications_entity_1 = require("./notifications.entity");
const notifications_resolver_1 = require("./notifications.resolver");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const notifications_service_1 = require("./notifications.service");
const companies_module_1 = require("../companies/companies.module");
const axios_1 = require("@nestjs/axios");
const microservices_1 = require("@nestjs/microservices");
const telegram_service_1 = require("../integrations/messageServices/telegram/telegram.service");
const sms_sender_a1_service_1 = require("../integrations/messageServices/smsA1/sms-sender-a1.service");
const telegram_module_1 = require("../integrations/messageServices/telegram/telegram.module");
let NotificationsModule = class NotificationsModule {
};
NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([notifications_entity_1.NotificationsEntity]),
            companies_module_1.CompaniesModule,
            axios_1.HttpModule,
            telegram_module_1.TelegramModule,
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'NOTIFICATION_SERVICE',
                    useFactory: () => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [process.env.RMQ_URL],
                            queue: 'bookform_notifications',
                            queueOptions: {
                                durable: false,
                            },
                        },
                    }),
                },
            ]),
        ],
        providers: [
            notifications_event_1.NotificationsEvent,
            notifications_resolver_1.NotificationsResolver,
            notifications_service_1.NotificationsService,
            {
                provide: 'PUB_SUB',
                useValue: new graphql_subscriptions_1.PubSub(),
            },
            telegram_service_1.TelegramService,
            sms_sender_a1_service_1.SMSSenderA1Service,
        ],
        exports: [notifications_event_1.NotificationsEvent, notifications_service_1.NotificationsService, telegram_service_1.TelegramService],
    })
], NotificationsModule);
exports.NotificationsModule = NotificationsModule;
//# sourceMappingURL=notifications.module.js.map