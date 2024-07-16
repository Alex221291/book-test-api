import { BaseMessageProvider } from './BaseMessageProvider';
import { NotificationsService } from '../../notifications/notifications.service';

class TelegramBotProvider extends BaseMessageProvider {
	protected token: string;
	protected chatId: string;
	protected text: string;
	public templates = {
		draft: '',
		cancelled: '',
	};

	constructor(
		protected readonly notificationService: NotificationsService,
		config: string,
	) {
		super();
		this.setConfig(JSON.parse(config));
	}

	async send(): Promise<void> {
		this.notificationService.sendTGMessage(this.token, this.chatId, this.text);
	}

	setBody(text: string): void {
		this.text = text;
	}

	setConfig(params: Record<string, any>): void {
		this.token = params.token;
		this.chatId = params.chatId;
		this.templates = {
			draft: params.draft,
			cancelled: params.cancelled,
		};
	}
}

export default TelegramBotProvider;
