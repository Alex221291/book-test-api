import { BaseEntity } from 'typeorm';
import { GroupsEntity } from './groups.entity';
import { CustomerEntity } from '../customers/customer.entity';
export declare class GroupsCustomersEntity extends BaseEntity {
    id: number;
    group: GroupsEntity;
    customer: CustomerEntity;
}
