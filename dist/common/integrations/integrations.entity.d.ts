import { BaseEntity } from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';
import { IntegrationsType } from './integrations.type';
import { IntegrationsProviderType } from './integrations.provider.type';
export declare class IntegrationsEntity extends BaseEntity {
    id: number;
    type: IntegrationsType;
    provider: IntegrationsProviderType;
    config: string;
    company: CompanyEntity;
}
