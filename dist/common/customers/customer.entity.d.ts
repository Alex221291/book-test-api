import { BaseEntity } from 'typeorm';
import { BookingEntity } from '../bookings/bookings.entity';
import { SubscriptionsEntity } from '../subscriptions/subscriptions.entity';
import { GroupsCustomersEntity } from '../groups/groups.customers.entity';
import { OfficesEntity } from '../offices/offices.entity';
import { CompanyEntity } from '../companies/companies.entity';
import { TagsEntity } from '../tags/tags.entity';
export declare class CustomerEntity extends BaseEntity {
    id: number;
    phone: string;
    firstName?: string;
    lastName: string;
    loyalty: string;
    blocked: number;
    birthday: Date;
    gender: string;
    notes: string;
    archived: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    company: CompanyEntity;
    bookings?: BookingEntity[];
    subscriptions?: SubscriptionsEntity[];
    groups?: GroupsCustomersEntity[];
    tags: TagsEntity[];
    offices: OfficesEntity[];
    constructor();
}
