import { BaseEntity } from 'typeorm';
import { ServiceEntity } from '../services/services.entity';
import { ScheduleEntity } from '../schedules/schedules.entity';
import { FileEntity } from '../file/file.entity';
import { UserEntity } from '../users/users.entity';
import { OfficesEntity } from '../offices/offices.entity';
import { WebFormEntity } from '../webforms/webform.entity';
export declare class EmployeeEntity extends BaseEntity {
    id: number;
    firstName: string;
    lastName: string;
    photo?: FileEntity;
    background?: FileEntity;
    phone: string;
    jobTitle: string;
    rate?: number;
    archived: boolean;
    office: OfficesEntity;
    user: UserEntity;
    services: ServiceEntity[];
    schedules: ScheduleEntity[];
    webForms: WebFormEntity[];
}
