import * as process from 'process';
import { BaseMessageProvider } from './BaseMessageProvider';
import { NotificationsService } from '../../notifications/notifications.service';

class RocketSMSProvider extends BaseMessageProvider {
	protected username: string;
	protected password: string;
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
		await this.notificationService.sendSMS(
			this.phone,
			this.text,
			// 'notifications_rocket_sms_send',
			{
				username: this.username,
				password: this.password,
			},
		);
	}

	setBody(text: string): void {
		this.text = text;
	}

	setRecipient(to: string): void {
		this.phone = to;
	}

	setConfig(params: Record<string, any>): void {
		this.username = params?.username || process.env.ROCKET_SMS_USERNAME;
		this.password = params?.password || process.env.ROCKET_SMS_PASSWORD;
		this.templates = {
			created: params['draft'],
			cancelled: params['cancelled'],
			updated: params['updated'],
			reminder: params['reminder'],
			code: params['code'],
		};
	}
}

export default RocketSMSProvider;
