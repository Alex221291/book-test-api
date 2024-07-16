import { BaseMessageProvider } from './BaseMessageProvider';
import { NotificationsService } from '../../notifications/notifications.service';
import { Logger } from '@nestjs/common';
declare class A1SMSProvider extends BaseMessageProvider {
    protected readonly notificationService: NotificationsService;
    protected readonly logger: Logger;
    protected user: string;
    protected apikey: string;
    protected phone: string;
    protected text: string;
    templates: {
        code: string;
        created: string;
        cancelled: string;
        updated: string;
        reminder: string;
    };
    constructor(notificationService: NotificationsService, config: string);
    send(): Promise<void>;
    setBody(text: string): void;
    setRecipient(to: string): void;
    setConfig(params: Record<string, any>): void;
}
export default A1SMSProvider;
