import { BaseEntity } from 'typeorm';
import { ScheduleEntity } from '../schedules/schedules.entity';
import { ServiceEntity } from '../services/services.entity';
import { OfficesEntity } from '../offices/offices.entity';
import { GroupsCustomersEntity } from './groups.customers.entity';
export declare class GroupsEntity extends BaseEntity {
    id: number;
    title: string;
    sinceDate: Date;
    untilDate: Date;
    archived: boolean;
    service: ServiceEntity;
    office: OfficesEntity;
    customers?: GroupsCustomersEntity[];
    schedules: ScheduleEntity[];
}
