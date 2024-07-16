import { BaseEntity } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { BookingEntity } from '../bookings/bookings.entity';
import { SubscriptionsEntity } from '../subscriptions/subscriptions.entity';
export declare class PaymentsEntity extends BaseEntity {
    id: number;
    type: string;
    account_key: string;
    purpose: string;
    details?: string;
    amount: string;
    currency: string;
    conversionRate: string;
    total: string;
    balance: string;
    createdAt: Date;
    user: UserEntity;
    bookings?: BookingEntity[];
    subscriptions?: SubscriptionsEntity[];
    constructor();
}
