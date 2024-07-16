import { ServiceEntity } from './services.entity';
import { ServicesService } from './services.service';
import { ServiceInput } from './services.input';
import { UserEntity } from '../users/users.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import ServicesPaginatedResponse from './types/services.paginate';
import { CompaniesService } from '../companies/companies.service';
export declare class ServicesResolver {
    private servicesService;
    private companiesService;
    constructor(servicesService: ServicesService, companiesService: CompaniesService);
    getAllServices(companyId: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<ServicesPaginatedResponse>;
    addService(user: UserEntity, hash: string, payload: ServiceInput): Promise<ServiceEntity>;
    updateService(user: UserEntity, id: number, payload: ServiceInput): Promise<ServiceEntity>;
    removeService(user: UserEntity, id: number): Promise<ServiceEntity>;
    getServiceById(id: number): Promise<ServiceEntity>;
    addServiceTag(user: UserEntity, serviceId: number, tagId: number): Promise<ServiceEntity>;
    removeServiceTag(user: UserEntity, serviceId: number, tagId: number): Promise<ServiceEntity>;
}
