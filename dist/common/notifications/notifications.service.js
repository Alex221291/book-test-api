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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notifications_entity_1 = require("./notifications.entity");
const companies_service_1 = require("../companies/companies.service");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const telegram_service_1 = require("../integrations/messageServices/telegram/telegram.service");
const sms_sender_a1_service_1 = require("../integrations/messageServices/smsA1/sms-sender-a1.service");
let NotificationsService = NotificationsService_1 = class NotificationsService extends base_service_1.BaseService {
    constructor(repository, companyService, notificationClient, telegramSender, smsA1Sender) {
        notificationClient.connect().catch((e) => {
            this.logger.warn(e);
        });
        super();
        this.repository = repository;
        this.companyService = companyService;
        this.notificationClient = notificationClient;
        this.telegramSender = telegramSender;
        this.smsA1Sender = smsA1Sender;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async sendSMS(phone, message, options = {}) {
        try {
            await this.smsA1Sender.sendSMS(process.env.A1_USERNAME, process.env.A1_APIKEY, phone, message);
        }
        catch (e) {
            this.logger.warn(e);
        }
    }
    async sendTGMessage(token, chatId, message) {
        try {
            await this.telegramSender.send(token, chatId, message);
        }
        catch (e) {
            this.logger.warn(e.message);
        }
    }
    async sendEmailMessage(to, subject, html) {
        const record = new microservices_1.RmqRecordBuilder({ to, subject, html }).build();
        try {
            await (0, rxjs_1.firstValueFrom)(this.notificationClient.send('notifications_email_send', record));
        }
        catch (e) {
            this.logger.warn(e.message);
        }
    }
    async createNotification(companyId, type, message, json) {
        const company = await this.companyService.findOneBy({
            hash: companyId,
        });
        if (company) {
            const entity = new notifications_entity_1.NotificationsEntity();
            entity.company = company;
            entity.type = type;
            entity.message = message;
            entity.json = json;
            return await this.add(entity);
        }
    }
};
NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notifications_entity_1.NotificationsEntity)),
    __param(2, (0, common_1.Inject)('NOTIFICATION_SERVICE')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        companies_service_1.CompaniesService,
        microservices_1.ClientProxy,
        telegram_service_1.TelegramService,
        sms_sender_a1_service_1.SMSSenderA1Service])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map