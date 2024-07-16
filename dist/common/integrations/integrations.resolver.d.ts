import { IntegrationsService } from './integrations.service';
import { UserEntity } from '../users/users.entity';
import { IntegrationsEntity } from './integrations.entity';
import { CompaniesService } from '../companies/companies.service';
import { IntegrationsSmsInput } from './dto/integrations.sms.input';
import { IntegrationsType } from './integrations.type';
import { IntegrationsTelegramInput } from './dto/integrations.telegram.input';
export declare class IntegrationsResolver {
    private integrationsService;
    private companyService;
    constructor(integrationsService: IntegrationsService, companyService: CompaniesService);
    checkIntegration(type: IntegrationsType, company: string): Promise<boolean>;
    getAllIntegrations(user: UserEntity, company: string): Promise<IntegrationsEntity[]>;
    getIntegration(user: UserEntity, type: IntegrationsType, company: string): Promise<IntegrationsEntity>;
    connectTelegramIntegration(user: UserEntity, hash: string, payload: IntegrationsTelegramInput): Promise<IntegrationsEntity>;
    connectSMSIntegration(user: UserEntity, hash: string, payload: IntegrationsSmsInput): Promise<IntegrationsEntity>;
    removeIntegration(user: UserEntity, id: number): Promise<IntegrationsEntity>;
}
