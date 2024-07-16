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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integrations_entity_1 = require("./integrations.entity");
const RocketSMSProvider_1 = require("./providers/RocketSMSProvider");
const integrations_provider_type_1 = require("./integrations.provider.type");
const TelegramBotProvider_1 = require("./providers/TelegramBotProvider");
const notifications_service_1 = require("../notifications/notifications.service");
const A1SMSProvider_1 = require("./providers/A1SMSProvider");
let IntegrationsService = class IntegrationsService extends base_service_1.BaseService {
    constructor(repository, notificationsService) {
        super();
        this.repository = repository;
        this.notificationsService = notificationsService;
    }
    getMessageIntegrationProvider(provider, config) {
        switch (provider) {
            case integrations_provider_type_1.IntegrationsProviderType.SYSTEM_SMS:
                return new A1SMSProvider_1.default(this.notificationsService, config);
            case integrations_provider_type_1.IntegrationsProviderType.ROCKET_SMS:
                return new RocketSMSProvider_1.default(this.notificationsService, config);
            case integrations_provider_type_1.IntegrationsProviderType.BOT:
                return new TelegramBotProvider_1.default(this.notificationsService, config);
            default:
                break;
        }
    }
};
IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(integrations_entity_1.IntegrationsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], IntegrationsService);
exports.IntegrationsService = IntegrationsService;
//# sourceMappingURL=integrations.service.js.map