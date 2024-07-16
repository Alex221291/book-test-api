import { Module } from '@nestjs/common';
import { NotificationsEvent } from './notifications.event';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsEntity } from './notifications.entity';
import { NotificationsResolver } from './notifications.resolver';
import { PubSub } from 'graphql-subscriptions';
import { NotificationsService } from './notifications.service';
import { CompaniesModule } from '../companies/companies.module';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TelegramService } from '../integrations/messageServices/telegram/telegram.service';
import { SMSSenderA1Service } from '../integrations/messageServices/smsA1/sms-sender-a1.service';
import { TelegramModule } from "../integrations/messageServices/telegram/telegram.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([NotificationsEntity]),
		CompaniesModule,
		HttpModule,
		TelegramModule,
		ClientsModule.registerAsync([
			{
				name: 'NOTIFICATION_SERVICE',
				useFactory: () => ({
					transport: Transport.RMQ,
					options: {
						urls: [process.env.RMQ_URL],
						queue: 'bookform_notifications',
						queueOptions: {
							durable: false,
						},
					},
				}),
			},
		]),
	],
	providers: [
		NotificationsEvent,
		NotificationsResolver,
		NotificationsService,
		{
			provide: 'PUB_SUB',
			useValue: new PubSub(),
		},
		TelegramService,
		SMSSenderA1Service,
	],
	exports: [NotificationsEvent, NotificationsService, TelegramService],
})
export class NotificationsModule {}
