import { BaseEntity } from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';
import { EmployeeEntity } from '../employees/employees.entity';
import { RoleTypes } from './users.role.enum';
import { PlansEntity } from '../plans/plans.entity';
import { PaymentsEntity } from '../payments/payments.entity';
export declare class UserEntity extends BaseEntity {
    id: number;
    email: string;
    confirmed: boolean;
    hash?: string;
    phone: string;
    birthday: Date;
    balance: string;
    password: string;
    active: boolean;
    role: RoleTypes;
    plan: PlansEntity;
    status: string;
    paidUntil?: Date;
    startOf?: Date;
    createdAt: Date;
    updatedAt: Date;
    companies: CompanyEntity[];
    employees?: EmployeeEntity[];
    payments: PaymentsEntity[];
    constructor(phone?: string, plainPassword?: string);
}
