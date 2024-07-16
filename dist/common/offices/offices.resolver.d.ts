import { OfficesService } from './offices.service';
import OfficesPaginatedResponse from './types/offices.paginate';
import { UserEntity } from '../users/users.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import { OfficesEntity } from './offices.entity';
import { OfficesInput } from './offices.input';
import { CompaniesService } from '../companies/companies.service';
export declare class OfficesResolver {
    private readonly officesService;
    private readonly companyService;
    constructor(officesService: OfficesService, companyService: CompaniesService);
    getMyOffices(user: UserEntity): Promise<OfficesEntity[]>;
    getOffices(user: UserEntity, companyId: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<OfficesPaginatedResponse>;
    addOffice(user: UserEntity, companyId: string, payload: OfficesInput): Promise<OfficesEntity>;
    updateOffice(user: UserEntity, id: number, companyId: string, payload: OfficesInput): Promise<OfficesEntity>;
    removeOffice(user: UserEntity, id: number): Promise<OfficesEntity>;
    getOffice(user: UserEntity, id: number, companyId: string): Promise<OfficesEntity>;
}
