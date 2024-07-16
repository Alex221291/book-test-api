import { forwardRef, Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './bookings.entity';
import { BookingsResolver } from './bookings.resolver';
import { CustomerModule } from '../customers/customer.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { ServicesModule } from '../services/services.module';
import { CompaniesModule } from '../companies/companies.module';
import { BookingEvents } from './bookings.event';
import { IntegrationsModule } from '../integrations/integrations.module';
import { EmployeesModule } from '../employees/employees.module';
import { OfficesModule } from '../offices/offices.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WebFormModule } from '../webforms/webform.module';
import { PaymentsModule } from '../payments/payments.module';
import { UsersModule } from '../users/users.module';
import { BookingsCron } from './bookings.cron';

@Module({
	imports: [
		forwardRef(() => CustomerModule),
		forwardRef(() => SchedulesModule),
		forwardRef(() => ServicesModule),
		CompaniesModule,
		OfficesModule,
		EmployeesModule,
		IntegrationsModule,
		NotificationsModule,
		WebFormModule,
		PaymentsModule,
		UsersModule,
		forwardRef(() => SubscriptionsModule),
		TypeOrmModule.forFeature([BookingEntity]),
	],
	providers: [BookingsService, BookingsResolver, BookingEvents, BookingsCron],
	exports: [BookingsService],
})
export class BookingsModule {}
