import { SubscriptionsEntity } from './subscriptions.entity';
import { SubscriptionsService } from './subscriptions.service';
import { UserEntity } from '../users/users.entity';
import { SubscriptionsInput } from './subscriptions.input';
import { CompaniesService } from '../companies/companies.service';
import { SubscriptionsPlanService } from './subscriptions.plan.service';
import { CustomerService } from '../customers/customer.service';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import SubscriptionsPaginatedResponse from './types/subscriptions.paginate';
import { BookingsService } from '../bookings/bookings.service';
export declare class SubscriptionsResolver {
    private readonly subscriptionsService;
    private readonly companiesService;
    private readonly subscriptionPlanService;
    private readonly customerService;
    private readonly bookingsService;
    constructor(subscriptionsService: SubscriptionsService, companiesService: CompaniesService, subscriptionPlanService: SubscriptionsPlanService, customerService: CustomerService, bookingsService: BookingsService);
    addSubscription(user: UserEntity, companyId: string, payload: SubscriptionsInput): Promise<SubscriptionsEntity>;
    updateSubscription(user: UserEntity, companyId: string, id: number, payload: SubscriptionsInput): Promise<SubscriptionsEntity>;
    getSubscriptions(user: UserEntity, companyId: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<SubscriptionsPaginatedResponse>;
    getSubscriptionsByOrderId(user: UserEntity, companyId: string, orderId: number, customerPhone: string): Promise<Array<SubscriptionsEntity>>;
    getSubscription(user: UserEntity, companyId: string, id: number): Promise<SubscriptionsEntity>;
}
