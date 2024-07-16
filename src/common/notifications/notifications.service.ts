import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsEntity } from './notifications.entity';
import { CompaniesService } from '../companies/companies.service';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TelegramService } from '../integrations/messageServices/telegram/telegram.service';
import { SMSSenderA1Service } from '../integrations/messageServices/smsA1/sms-sender-a1.service';

@Injectable()
export class NotificationsService extends BaseService<NotificationsEntity> {
	protected readonly logger = new Logger(NotificationsService.name);

	constructor(
		@InjectRepository(NotificationsEntity)
		protected repository: Repository<NotificationsEntity>,
		private readonly companyService: CompaniesService,
		@Inject('NOTIFICATION_SERVICE')
		private readonly notificationClient: ClientProxy,
		private readonly telegramSender: TelegramService,
		private readonly smsA1Sender: SMSSenderA1Service,
	) {
		notificationClient.connect().catch((e) => {
			this.logger.warn(e);
		});
		super();
	}

	public async sendSMS(
		phone: string,
		message: string,
		options: Record<string, any> = {},
	) {
		try {
			await this.smsA1Sender.sendSMS(
				process.env.A1_USERNAME,
				process.env.A1_APIKEY,
				phone,
				message,
			);
		} catch (e) {
			this.logger.warn(e);
		}
	}

	public async sendTGMessage(token: string, chatId: string, message: string) {
		try {
			await this.telegramSender.send(token, chatId, message);
		} catch (e) {
			this.logger.warn(e.message);
		}
	}

	public async sendEmailMessage(to: string, subject: string, html: string) {
		const record = new RmqRecordBuilder({ to, subject, html }).build();
		try {
			await firstValueFrom(
				this.notificationClient.send('notifications_email_send', record),
			);
		} catch (e) {
			this.logger.warn(e.message);
		}
	}

	public async createNotification(
		companyId: string,
		type: string,
		message: string,
		json: string,
	) {
		const company = await this.companyService.findOneBy({
			hash: companyId,
		});
		if (company) {
			const entity = new NotificationsEntity();
			entity.company = company;
			entity.type = type;
			entity.message = message;
			entity.json = json;
			return await this.add(entity);
		}
	}
}
