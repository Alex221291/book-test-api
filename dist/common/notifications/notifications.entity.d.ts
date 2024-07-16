import { BaseEntity } from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';
export declare class NotificationsEntity extends BaseEntity {
    id: number;
    type: string;
    message: string;
    read: boolean;
    json: string;
    createdAt: Date;
    company: CompanyEntity;
    constructor();
}
