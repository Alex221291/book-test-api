import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsEntity } from './groups.entity';
import { GroupsService } from './groups.service';
import { GroupsResolver } from './groups.resolver';
import { CompaniesModule } from '../companies/companies.module';
import { ServicesModule } from '../services/services.module';
import { OfficesModule } from '../offices/offices.module';
import { GroupsCustomersEntity } from './groups.customers.entity';
import { GroupsCustomersService } from './groups.customers.service';
import { GroupsCustomersResolver } from './groups.customers.resolver';
import { CustomerModule } from '../customers/customer.module';
import { GroupsCron } from './groups.cron';
import { SchedulesModule } from '../schedules/schedules.module';
import { BookingsModule } from '../bookings/bookings.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
	imports: [
		CompaniesModule,
		forwardRef(() => ServicesModule),
		OfficesModule,
		BookingsModule,
		NotificationsModule,
		forwardRef(() => SchedulesModule),
		forwardRef(() => CustomerModule),
		TypeOrmModule.forFeature([GroupsEntity, GroupsCustomersEntity]),
	],
	providers: [
		GroupsService,
		GroupsResolver,
		GroupsCustomersService,
		GroupsCustomersResolver,
		GroupsCron,
	],
	exports: [GroupsService, GroupsCustomersService],
})
export class GroupsModule {}
