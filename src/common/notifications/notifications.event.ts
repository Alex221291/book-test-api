import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { I18nService } from 'nestjs-i18n';
import { PubSub } from 'graphql-subscriptions';
import { NotificationsService } from './notifications.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NotificationsEvent {
	protected readonly logger = new Logger(NotificationsEvent.name);
	constructor(
		private readonly eventEmitter: EventEmitter2,
		private readonly i18n: I18nService,
		private readonly notificationsService: NotificationsService,
		private readonly httpService: HttpService,
		@Inject('PUB_SUB')
		private readonly pubSub: PubSub,
	) {}

	public async addNotification(
		companyId: string,
		type: string,
		message: string,
		json: string,
	) {
		const entity = await this.notificationsService.createNotification(
			companyId,
			type,
			message,
			json,
		);
		if (entity) {
			await this.pubSub.publish('notificationAdded', {
				notificationAdded: entity,
			});
		}
	}
}
