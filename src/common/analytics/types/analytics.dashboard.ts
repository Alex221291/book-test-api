import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import AnalyticsChart from './analytics.chart';

@ObjectType()
class AnalyticsDashboard {
	@Field(() => Float)
	revenue: number;

	@Field(() => Float)
	average: number;

	@Field(() => [AnalyticsChart])
	servicesRate: AnalyticsChart[];

	@Field(() => [AnalyticsChart])
	loadingDynamic: AnalyticsChart[];

	@Field(() => [AnalyticsChart])
	revenueByEmployee: AnalyticsChart[];

	@Field(() => [AnalyticsChart])
	revenueByServices: AnalyticsChart[];

	@Field(() => Int)
	totalBookings: number;

	@Field(() => Int)
	totalCancelledBookings: number;

	@Field(() => Int)
	totalCompletedBookings: number;
}

export default AnalyticsDashboard;
