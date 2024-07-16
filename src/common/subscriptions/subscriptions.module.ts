import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionsEntity } from './subscriptions.entity';
import { SubscriptionsPlanEntity } from './subscriptions.plan.entity';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { SubscriptionsPlanResolver } from './subscriptions.plan.resolver';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsPlanService } from './subscriptions.plan.service';
import { CompaniesModule } from '../companies/companies.module';
import { ServicesModule } from '../services/services.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customers/customer.module';
import { BookingsModule } from '../bookings/bookings.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
	imports: [
		CompaniesModule,
		forwardRef(() => ServicesModule),
		forwardRef(() => CustomerModule),
		PaymentsModule,
		forwardRef(() => BookingsModule),
		TypeOrmModule.forFeature([SubscriptionsPlanEntity, SubscriptionsEntity]),
	],
	providers: [
		SubscriptionsResolver,
		SubscriptionsPlanResolver,
		SubscriptionsService,
		SubscriptionsPlanService,
	],
	exports: [SubscriptionsPlanService, SubscriptionsService],
})
export class SubscriptionsModule {}
