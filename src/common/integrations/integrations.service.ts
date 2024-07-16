import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationsEntity } from './integrations.entity';
import RocketSMSProvider from './providers/RocketSMSProvider';
import { IntegrationsProviderType } from './integrations.provider.type';
import { MessageProviderInterface } from './providers/MessageProviderInterface';
import TelegramBotProvider from './providers/TelegramBotProvider';
import { NotificationsService } from '../notifications/notifications.service';
import A1SMSProvider from './providers/A1SMSProvider';

@Injectable()
export class IntegrationsService extends BaseService<IntegrationsEntity> {
	constructor(
		@InjectRepository(IntegrationsEntity)
		protected repository: Repository<IntegrationsEntity>,
		private readonly notificationsService: NotificationsService,
	) {
		super();
	}

	public getMessageIntegrationProvider(
		provider: IntegrationsProviderType,
		config: string,
	): MessageProviderInterface {
		switch (provider) {
			case IntegrationsProviderType.SYSTEM_SMS:
				return new A1SMSProvider(this.notificationsService, config);
			case IntegrationsProviderType.ROCKET_SMS:
				return new RocketSMSProvider(this.notificationsService, config);
			case IntegrationsProviderType.BOT:
				return new TelegramBotProvider(this.notificationsService, config);
			default:
				break;
		}
	}
}
