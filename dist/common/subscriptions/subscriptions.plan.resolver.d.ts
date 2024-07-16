import { SubscriptionsPlanEntity } from './subscriptions.plan.entity';
import { SubscriptionsPlanService } from './subscriptions.plan.service';
import { SubscriptionsPlanInput } from './subscriptions.plan.input';
import { UserEntity } from '../users/users.entity';
import { CompaniesService } from '../companies/companies.service';
import { ServicesService } from '../services/services.service';
import SubscriptionsPlanPaginatedResponse from './types/subscriptions.plan.paginate';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
export declare class SubscriptionsPlanResolver {
    private readonly subscriptionsPlanService;
    private readonly companiesService;
    private readonly servicesService;
    constructor(subscriptionsPlanService: SubscriptionsPlanService, companiesService: CompaniesService, servicesService: ServicesService);
    private prepareEntity;
    addSubscriptionPlan(user: UserEntity, companyId: string, payload: SubscriptionsPlanInput): Promise<SubscriptionsPlanEntity>;
    updateSubscriptionPlan(user: UserEntity, companyId: string, payload: SubscriptionsPlanInput, id: number): Promise<SubscriptionsPlanEntity>;
    getSubscriptionPlans(user: UserEntity, companyId: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<SubscriptionsPlanPaginatedResponse>;
    getSubscriptionPlan(user: UserEntity, companyId: string, id: number): Promise<SubscriptionsPlanEntity>;
    removeSubscriptionPlan(user: UserEntity, companyId: string, id: number): Promise<SubscriptionsPlanEntity>;
}
