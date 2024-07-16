import { BaseEntity } from 'typeorm';
import { SubscriptionsPlanEntity } from './subscriptions.plan.entity';
import { CustomerEntity } from '../customers/customer.entity';
import { BookingEntity } from '../bookings/bookings.entity';
import { PaymentsEntity } from '../payments/payments.entity';
export declare class SubscriptionsEntity extends BaseEntity {
    id: number;
    firstVisit?: Date;
    sinceDate: Date;
    untilDate: Date;
    createdAt: Date;
    archived: boolean;
    payment: PaymentsEntity;
    customer: CustomerEntity;
    plan: SubscriptionsPlanEntity;
    bookings?: BookingEntity[];
    constructor();
}
