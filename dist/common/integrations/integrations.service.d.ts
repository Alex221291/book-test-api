import { BaseService } from '../../base/base.service';
import { Repository } from 'typeorm';
import { IntegrationsEntity } from './integrations.entity';
import { IntegrationsProviderType } from './integrations.provider.type';
import { MessageProviderInterface } from './providers/MessageProviderInterface';
import { NotificationsService } from '../notifications/notifications.service';
export declare class IntegrationsService extends BaseService<IntegrationsEntity> {
    protected repository: Repository<IntegrationsEntity>;
    private readonly notificationsService;
    constructor(repository: Repository<IntegrationsEntity>, notificationsService: NotificationsService);
    getMessageIntegrationProvider(provider: IntegrationsProviderType, config: string): MessageProviderInterface;
}
