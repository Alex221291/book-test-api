import { BaseEntity } from 'typeorm';
import { CustomerEntity } from '../customers/customer.entity';
import { CompanyEntity } from '../companies/companies.entity';
import { ServiceEntity } from '../services/services.entity';
export declare class TagsEntity extends BaseEntity {
    id: number;
    title: string;
    color: string;
    createdAt: Date;
    customers?: CustomerEntity[];
    services?: ServiceEntity[];
    company: CompanyEntity;
    constructor();
}
