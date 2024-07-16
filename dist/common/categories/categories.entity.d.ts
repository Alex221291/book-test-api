import { BaseEntity } from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';
import { ServiceEntity } from '../services/services.entity';
export declare class CategoriesEntity extends BaseEntity {
    id: number;
    title: string;
    archived: boolean;
    company: CompanyEntity;
    services: ServiceEntity[];
}
