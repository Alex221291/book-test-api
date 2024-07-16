import { PaymentsService } from './payments.service';
import { PlansService } from '../plans/plans.services';
export declare class PaymentsEvent {
    private readonly paymentsService;
    private readonly plansService;
    static BOOKING_SERVICE_FEE: string;
    static CLOSING_BOOKING_PAYMENT: string;
    static SUBSCRIPTION_SALE: string;
    constructor(paymentsService: PaymentsService, plansService: PlansService);
    bookingServiceFee(userId: number): Promise<import("./payments.entity").PaymentsEntity>;
}
