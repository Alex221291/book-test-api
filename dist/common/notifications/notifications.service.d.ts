import { Logger } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { Repository } from 'typeorm';
import { NotificationsEntity } from './notifications.entity';
import { CompaniesService } from '../companies/companies.service';
import { ClientProxy } from '@nestjs/microservices';
import { TelegramService } from '../integrations/messageServices/telegram/telegram.service';
import { SMSSenderA1Service } from '../integrations/messageServices/smsA1/sms-sender-a1.service';
export declare class NotificationsService extends BaseService<NotificationsEntity> {
    protected repository: Repository<NotificationsEntity>;
    private readonly companyService;
    private readonly notificationClient;
    private readonly telegramSender;
    private readonly smsA1Sender;
    protected readonly logger: Logger;
    constructor(repository: Repository<NotificationsEntity>, companyService: CompaniesService, notificationClient: ClientProxy, telegramSender: TelegramService, smsA1Sender: SMSSenderA1Service);
    sendSMS(phone: string, message: string, options?: Record<string, any>): Promise<void>;
    sendTGMessage(token: string, chatId: string, message: string): Promise<void>;
    sendEmailMessage(to: string, subject: string, html: string): Promise<void>;
    createNotification(companyId: string, type: string, message: string, json: string): Promise<NotificationsEntity>;
}
