import { BaseEntity } from 'typeorm';
import { EmployeeEntity } from '../employees/employees.entity';
import { BookingEntity } from '../bookings/bookings.entity';
import { ServiceEntity } from '../services/services.entity';
import { GroupsEntity } from '../groups/groups.entity';
import { SchedulesType } from './types/schedules.type';
export declare class ScheduleEntity extends BaseEntity {
    id: number;
    type: SchedulesType;
    startTime: string;
    finishTime: string;
    createdAt?: Date;
    updatedAt?: Date;
    sinceDate: Date;
    untilDate: Date;
    cancelled: number;
    employee: EmployeeEntity;
    services: ServiceEntity[];
    bookings: BookingEntity[];
    group: GroupsEntity;
    constructor();
}
