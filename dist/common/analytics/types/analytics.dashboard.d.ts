import AnalyticsChart from './analytics.chart';
declare class AnalyticsDashboard {
    revenue: number;
    average: number;
    servicesRate: AnalyticsChart[];
    loadingDynamic: AnalyticsChart[];
    revenueByEmployee: AnalyticsChart[];
    revenueByServices: AnalyticsChart[];
    totalBookings: number;
    totalCancelledBookings: number;
    totalCompletedBookings: number;
}
export default AnalyticsDashboard;
