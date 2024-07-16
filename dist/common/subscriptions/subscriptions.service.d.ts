import { BaseService } from '../../base/base.service';
import { SubscriptionsEntity } from './subscriptions.entity';
import { Repository } from 'typeorm';
import { SubscriptionsInput } from './subscriptions.input';
import { SubscriptionsPlanService } from './subscriptions.plan.service';
import { CustomerService } from '../customers/customer.service';
import { CompanyEntity } from '../companies/companies.entity';
import { UserEntity } from '../users/users.entity';
import { PaymentsService } from '../payments/payments.service';
export declare class SubscriptionsService extends BaseService<SubscriptionsEntity> {
    protected repository: Repository<SubscriptionsEntity>;
    private readonly subscriptionPlanService;
    private readonly customerService;
    private readonly paymentsService;
    constructor(repository: Repository<SubscriptionsEntity>, subscriptionPlanService: SubscriptionsPlanService, customerService: CustomerService, paymentsService: PaymentsService);
    prepareEntity(payload: SubscriptionsInput, entity: SubscriptionsEntity, company: CompanyEntity, user: UserEntity): Promise<SubscriptionsEntity>;
    findSubscriptionsByServicesIds(companyId: string, serviceIds: number[], customerPhone: string, userId: number): Promise<Array<SubscriptionsEntity>>;
}
