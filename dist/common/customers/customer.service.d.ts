import { BaseService } from '../../base/base.service';
import { CustomerEntity } from './customer.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CustomerInput } from './customer.input';
import { CompanyEntity } from '../companies/companies.entity';
import { TagsService } from '../tags/tags.service';
import CustomerPaginatedResponse from './types/customer.paginate';
import { UserEntity } from '../users/users.entity';
import FiltersType from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
export declare class CustomerService extends BaseService<CustomerEntity> {
    protected repository: Repository<CustomerEntity>;
    private readonly tagsService;
    constructor(repository: Repository<CustomerEntity>, tagsService: TagsService);
    prepare(entity: CustomerEntity, payload: CustomerInput, company?: CompanyEntity): CustomerEntity;
    getCustomers(filters: FiltersType[], sorters: SorterType[], companyId: string, user: UserEntity, offset?: number, limit?: any): Promise<CustomerPaginatedResponse>;
    getCustomer(where: FindOptionsWhere<CustomerEntity>, userId: number): Promise<CustomerEntity>;
    addTag(customerId: number, tagId: number, userId: number): Promise<CustomerEntity>;
    removeTag(customerId: number, tagId: number, userId: number): Promise<CustomerEntity>;
}
