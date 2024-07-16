import { BaseMessageProvider } from './BaseMessageProvider';
import { NotificationsService } from '../../notifications/notifications.service';
import { Logger } from '@nestjs/common';

class A1SMSProvider extends BaseMessageProvider {
	protected readonly logger = new Logger(A1SMSProvider.name);

	protected user: string;
	protected apikey: string;
	protected phone: string;
	protected text: string;
	public templates = {
		code: '',
		created: '',
		cancelled: '',
		updated: '',
		reminder: '',
	};

	constructor(
		protected readonly notificationService: NotificationsService,
		config: string,
	) {
		super();
		this.setConfig(JSON.parse(config));
	}

	async send() {
		this.logger.log(this.text);
		await this.notificationService.sendSMS(this.phone, this.text, {
			user: this.user,
			apikey: this.apikey,
		});
	}

	setBody(text: string): void {
		this.text = text;
	}

	setRecipient(to: string): void {
		this.phone = to;
	}

	setConfig(params: Record<string, any>): void {
		this.user = params.user;
		this.apikey = params.apikey;
		this.templates = {
			created: params['draft'],
			cancelled: params['cancelled'],
			updated: params['updated'],
			reminder: params['reminder'],
			code: params['code'],
		};
	}
}

export default A1SMSProvider;
