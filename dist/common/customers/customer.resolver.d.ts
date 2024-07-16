import { CustomerEntity } from './customer.entity';
import { CustomerService } from './customer.service';
import { UserEntity } from '../users/users.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import CustomerPaginatedResponse from './types/customer.paginate';
import { CustomerInput } from './customer.input';
import { CompaniesService } from '../companies/companies.service';
export declare class CustomerResolver {
    private customerService;
    private companiesService;
    constructor(customerService: CustomerService, companiesService: CompaniesService);
    getCustomers(user: UserEntity, company: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<CustomerPaginatedResponse>;
    getCustomer(user: UserEntity, id: number): Promise<Record<string, any>>;
    addCustomer(user: UserEntity, payload: CustomerInput, companyId: string): Promise<CustomerEntity>;
    addCustomerTag(user: UserEntity, customerId: number, tagId: number): Promise<CustomerEntity>;
    removeCustomerTag(user: UserEntity, customerId: number, tagId: number): Promise<CustomerEntity>;
    updateCustomer(user: UserEntity, id: number, payload: CustomerInput): Promise<CustomerEntity>;
    removeCustomer(user: UserEntity, id: number): Promise<CustomerEntity>;
}
