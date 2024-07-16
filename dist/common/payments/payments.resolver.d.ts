import { PaymentsService } from './payments.service';
import { UserEntity } from '../users/users.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import PaymentsPaginatedResponse from './types/PaymentsPaginatedResponse';
export declare class PaymentsResolver {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getPayments(user: UserEntity, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<PaymentsPaginatedResponse>;
    getBalance(user: UserEntity, account: string): Promise<string>;
}
