import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { I18nService } from 'nestjs-i18n';
import { PubSub } from 'graphql-subscriptions';
import { NotificationsService } from './notifications.service';
import { HttpService } from '@nestjs/axios';
export declare class NotificationsEvent {
    private readonly eventEmitter;
    private readonly i18n;
    private readonly notificationsService;
    private readonly httpService;
    private readonly pubSub;
    protected readonly logger: Logger;
    constructor(eventEmitter: EventEmitter2, i18n: I18nService, notificationsService: NotificationsService, httpService: HttpService, pubSub: PubSub);
    addNotification(companyId: string, type: string, message: string, json: string): Promise<void>;
}
