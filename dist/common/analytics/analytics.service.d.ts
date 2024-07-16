import { BookingsService } from '../bookings/bookings.service';
import { PaymentsService } from '../payments/payments.service';
export declare class AnalyticsService {
    private bookingsService;
    private paymentsService;
    constructor(bookingsService: BookingsService, paymentsService: PaymentsService);
    getRevenue(hash: string, dateStart: string, dateFinish: string): Promise<any>;
    getAverage(hash: string, dateStart: string, dateFinish: string): Promise<any>;
    revenueByEmployee(hash: string, dateStart: string, dateFinish: string): Promise<any[]>;
    revenueByServices(hash: string, dateStart: string, dateFinish: string): Promise<any[]>;
    customerVisitsByService(customerId: number, serviceIds: number[]): Promise<any[]>;
    getServicesRate(companyHash: string, dateStart: string, dateFinish: string): Promise<any[]>;
    getLoadingDynamic(companyHash: string, dateStart: string, dateFinish: string): Promise<any[]>;
    getAllBookings(companyHash: string, dateStart: string, dateFinish: string): Promise<number>;
    getCancelledBookings(companyHash: string, dateStart: string, dateFinish: string): Promise<number>;
    getCompletedBookings(companyHash: string, dateStart: string, dateFinish: string): Promise<number>;
}
