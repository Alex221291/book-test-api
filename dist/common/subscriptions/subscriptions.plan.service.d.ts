import { BaseService } from '../../base/base.service';
import { SubscriptionsPlanEntity } from './subscriptions.plan.entity';
import { Repository } from 'typeorm';
export declare class SubscriptionsPlanService extends BaseService<SubscriptionsPlanEntity> {
    protected repository: Repository<SubscriptionsPlanEntity>;
    constructor(repository: Repository<SubscriptionsPlanEntity>);
    getSubscriptionsPlanById(userId: number, companyId: string, id: number): Promise<SubscriptionsPlanEntity>;
}
