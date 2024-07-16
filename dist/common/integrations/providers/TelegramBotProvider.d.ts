import { BaseMessageProvider } from './BaseMessageProvider';
import { NotificationsService } from '../../notifications/notifications.service';
declare class TelegramBotProvider extends BaseMessageProvider {
    protected readonly notificationService: NotificationsService;
    protected token: string;
    protected chatId: string;
    protected text: string;
    templates: {
        draft: string;
        cancelled: string;
    };
    constructor(notificationService: NotificationsService, config: string);
    send(): Promise<void>;
    setBody(text: string): void;
    setConfig(params: Record<string, any>): void;
}
export default TelegramBotProvider;
