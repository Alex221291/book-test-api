import { IntegrationsProviderType } from '../integrations.provider.type';
export declare class IntegrationsSmsInput {
    provider: IntegrationsProviderType;
    code: string;
    draft: string;
    cancelled: string;
    updated: string;
    reminder: string;
    username: string;
    password: string;
}
