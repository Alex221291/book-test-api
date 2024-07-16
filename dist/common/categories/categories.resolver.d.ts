import { CategoriesService } from './categories.service';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import CategoriesPaginatedResponse from './types/categories.paginate';
import { CategoriesEntity } from './categories.entity';
import { UserEntity } from '../users/users.entity';
import { CategoriesInput } from './categories.input';
export declare class CategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getCategories(companyId: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<CategoriesPaginatedResponse>;
    getCategoryById(user: UserEntity, id: number, companyId: string): Promise<CategoriesEntity>;
    updateCategory(user: UserEntity, id: number, payload: CategoriesInput, companyId: string): Promise<CategoriesEntity>;
    removeCategory(user: UserEntity, id: number, companyId: string): Promise<CategoriesEntity>;
}
