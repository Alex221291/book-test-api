import { BaseEntity } from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';
import { EmployeeEntity } from '../employees/employees.entity';
import { ScheduleEntity } from '../schedules/schedules.entity';
import { GroupsEntity } from '../groups/groups.entity';
import { CurrencyTypes } from '../../base/types/currency.enum';
import { CategoriesEntity } from '../categories/categories.entity';
import { WebFormEntity } from '../webforms/webform.entity';
import { TagsEntity } from '../tags/tags.entity';
export declare class ServiceEntity extends BaseEntity {
    id?: number;
    title: string;
    description: string;
    duration: number;
    price: number;
    maxPrice: number;
    currency: CurrencyTypes;
    archived: boolean;
    weight: number;
    company: CompanyEntity;
    category: CategoriesEntity;
    employees?: EmployeeEntity[];
    schedules: ScheduleEntity[];
    subscriptionPlans: ScheduleEntity[];
    groups: GroupsEntity[];
    webForms: WebFormEntity[];
    tags: TagsEntity[];
}
