import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationsEntity } from './integrations.entity';
import { IntegrationsService } from './integrations.service';
import { IntegrationsResolver } from './integrations.resolver';
import { CompaniesModule } from '../companies/companies.module';
import { HttpModule } from '@nestjs/axios';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
	imports: [
		CompaniesModule,
		TypeOrmModule.forFeature([IntegrationsEntity]),
		HttpModule,
		NotificationsModule,
	],
	providers: [IntegrationsService, IntegrationsResolver],
	exports: [IntegrationsService],
})
export class IntegrationsModule {}
