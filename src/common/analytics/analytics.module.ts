import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { BookingsModule } from '../bookings/bookings.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
	imports: [BookingsModule, PaymentsModule],
	providers: [AnalyticsService, AnalyticsResolver],
})
export class AnalyticsModule {}
