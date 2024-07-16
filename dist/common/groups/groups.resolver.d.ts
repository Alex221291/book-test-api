import { GroupsEntity } from './groups.entity';
import { GroupsService } from './groups.service';
import { UserEntity } from '../users/users.entity';
import { GroupsInput } from './groups.input';
import { CompaniesService } from '../companies/companies.service';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import GroupsPaginatedResponse from './types/groups.paginate';
import { ServicesService } from '../services/services.service';
import { OfficesService } from '../offices/offices.service';
export declare class GroupsResolver {
    private readonly groupService;
    private readonly companiesService;
    private readonly serviceService;
    private readonly officesService;
    constructor(groupService: GroupsService, companiesService: CompaniesService, serviceService: ServicesService, officesService: OfficesService);
    addGroup(user: UserEntity, companyId: string, payload: GroupsInput): Promise<GroupsEntity>;
    updateGroup(user: UserEntity, companyId: string, id: number, payload: GroupsInput): Promise<GroupsEntity>;
    removeGroup(user: UserEntity, companyId: string, id: number): Promise<GroupsEntity>;
    getGroup(user: UserEntity, companyId: string, id: number): Promise<GroupsEntity>;
    getGroups(user: UserEntity, companyId: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<GroupsPaginatedResponse>;
}
