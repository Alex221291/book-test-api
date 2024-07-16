import { BaseEntity } from 'typeorm';
import { OfficesEntity } from '../offices/offices.entity';
import { EmployeeEntity } from '../employees/employees.entity';
import { ServiceEntity } from '../services/services.entity';
import { BookingEntity } from '../bookings/bookings.entity';
export declare class WebFormEntity extends BaseEntity {
    id: number;
    title: string;
    type: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    hash: string;
    pinProtection: boolean;
    isProtected: boolean;
    archived: boolean;
    delay: number;
    pitch: number;
    firstStepHidden: boolean;
    maxAppointmentPeriod: number;
    office: OfficesEntity;
    employees: EmployeeEntity[];
    services: ServiceEntity[];
    bookings: BookingEntity[];
    constructor();
}
