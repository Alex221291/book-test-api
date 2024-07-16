import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import AnalyticsDashboard from './types/analytics.dashboard';
import AnalyticsChart from './types/analytics.chart';

@Resolver()
export class AnalyticsResolver {
	constructor(private analyticsService: AnalyticsService) {}

	@Query(() => AnalyticsDashboard)
	async getDashboardStats(
		@Args('company') company: string,
		@Args('dateStart') dateStart: string,
		@Args('dateFinish') dateFinish: string,
	): Promise<AnalyticsDashboard> {
		const entity = new AnalyticsDashboard();
		entity.revenue = await this.analyticsService.getRevenue(
			company,
			dateStart,
			dateFinish,
		);
		entity.average = await this.analyticsService.getAverage(
			company,
			dateStart,
			dateFinish,
		);
		entity.revenueByEmployee = await this.analyticsService.revenueByEmployee(
			company,
			dateStart,
			dateFinish,
		);
		entity.revenueByServices = await this.analyticsService.revenueByServices(
			company,
			dateStart,
			dateFinish,
		);
		entity.loadingDynamic = await this.analyticsService.getLoadingDynamic(
			company,
			dateStart,
			dateFinish,
		);
		entity.servicesRate = await this.analyticsService.getServicesRate(
			company,
			dateStart,
			dateFinish,
		);
		entity.totalBookings = await this.analyticsService.getAllBookings(
			company,
			dateStart,
			dateFinish,
		);
		entity.totalCancelledBookings =
			await this.analyticsService.getCancelledBookings(
				company,
				dateStart,
				dateFinish,
			);
		entity.totalCompletedBookings =
			await this.analyticsService.getCompletedBookings(
				company,
				dateStart,
				dateFinish,
			);
		return entity;
	}

	@Query(() => [AnalyticsChart])
	async getCustomerVisitsByServices(
		@Args('customerId', { type: () => Int }) customerId: number,
		@Args('serviceIds', { type: () => [Int] }) serviceIds: number[],
	): Promise<Array<AnalyticsChart>> {
		const data = await this.analyticsService.customerVisitsByService(
			customerId,
			serviceIds,
		);
		return data
			.filter(
				(el) => serviceIds.findIndex((id) => el?.group?.indexOf(id) > -1) > -1,
			)
			.map((el) => ({
				label: el.label,
				value: el.total,
				type: el.type,
			}));
	}
}
