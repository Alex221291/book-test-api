import { BaseEntity } from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';
import { EmployeeEntity } from '../employees/employees.entity';
import { BookingEntity } from '../bookings/bookings.entity';
import { GroupsEntity } from '../groups/groups.entity';
import { WebFormEntity } from '../webforms/webform.entity';
import { CustomerEntity } from '../customers/customer.entity';
export declare class OfficesEntity extends BaseEntity {
    id: number;
    title: string;
    address: string;
    phone: string;
    workingDays: string;
    archived: boolean;
    company: CompanyEntity;
    employees?: EmployeeEntity[];
    customers?: CustomerEntity[];
    bookings?: BookingEntity[];
    groups?: GroupsEntity[];
    webForms?: WebFormEntity[];
}
