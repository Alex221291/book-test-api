import { AnalyticsService } from './analytics.service';
import AnalyticsDashboard from './types/analytics.dashboard';
import AnalyticsChart from './types/analytics.chart';
export declare class AnalyticsResolver {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(company: string, dateStart: string, dateFinish: string): Promise<AnalyticsDashboard>;
    getCustomerVisitsByServices(customerId: number, serviceIds: number[]): Promise<Array<AnalyticsChart>>;
}
