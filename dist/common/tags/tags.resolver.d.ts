import { TagsEntity } from './tags.entity';
import { TagsService } from './tags.service';
import { UserEntity } from '../users/users.entity';
import { TagsInput } from './tags.input';
import { CompaniesService } from '../companies/companies.service';
import TagsPaginatedResponse from './types/tags.paginate';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
export declare class TagsResolver {
    private readonly tagsService;
    private readonly companiesService;
    constructor(tagsService: TagsService, companiesService: CompaniesService);
    addTag(user: UserEntity, companyId: string, payload: TagsInput): Promise<TagsEntity>;
    updateTag(user: UserEntity, id: number, companyId: string, payload: TagsInput): Promise<TagsEntity>;
    removeTag(user: UserEntity, id: number, companyId: string): Promise<boolean>;
    getTags(user: UserEntity, companyId: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<TagsPaginatedResponse>;
}
