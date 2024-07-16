"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsEvent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsEvent = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const nestjs_i18n_1 = require("nestjs-i18n");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const notifications_service_1 = require("./notifications.service");
const axios_1 = require("@nestjs/axios");
let NotificationsEvent = NotificationsEvent_1 = class NotificationsEvent {
    constructor(eventEmitter, i18n, notificationsService, httpService, pubSub) {
        this.eventEmitter = eventEmitter;
        this.i18n = i18n;
        this.notificationsService = notificationsService;
        this.httpService = httpService;
        this.pubSub = pubSub;
        this.logger = new common_1.Logger(NotificationsEvent_1.name);
    }
    async addNotification(companyId, type, message, json) {
        const entity = await this.notificationsService.createNotification(companyId, type, message, json);
        if (entity) {
            await this.pubSub.publish('notificationAdded', {
                notificationAdded: entity,
            });
        }
    }
};
NotificationsEvent = NotificationsEvent_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Inject)('PUB_SUB')),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        nestjs_i18n_1.I18nService,
        notifications_service_1.NotificationsService,
        axios_1.HttpService,
        graphql_subscriptions_1.PubSub])
], NotificationsEvent);
exports.NotificationsEvent = NotificationsEvent;
//# sourceMappingURL=notifications.event.js.map