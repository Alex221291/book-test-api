import { BaseMessageProvider } from './BaseMessageProvider';
import { NotificationsService } from '../../notifications/notifications.service';
declare class RocketSMSProvider extends BaseMessageProvider {
    protected readonly notificationService: NotificationsService;
    protected username: string;
    protected password: string;
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
export default RocketSMSProvider;
