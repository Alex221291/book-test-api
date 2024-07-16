import { BaseEntity } from 'typeorm';
import { ServiceEntity } from '../services/services.entity';
import { CompanyEntity } from '../companies/companies.entity';
import { SubscriptionsEntity } from './subscriptions.entity';
import { CurrencyTypes } from '../../base/types/currency.enum';
export declare class SubscriptionsPlanEntity extends BaseEntity {
    id: number;
    title: string;
    price: number;
    currency: CurrencyTypes;
    validity: number;
    unit: string;
    activationType: string;
    visits: number;
    archived: boolean;
    createdAt: Date;
    updatedAt: Date;
    services: ServiceEntity[];
    company: CompanyEntity;
    subscriptions?: SubscriptionsEntity[];
    constructor();
}
