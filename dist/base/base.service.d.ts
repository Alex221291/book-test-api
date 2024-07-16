import { FindManyOptions, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseServiceInterface } from './base.service.interface';
import FiltersType from './graphql-filter/types/filters.type';
import { Logger } from '@nestjs/common';
import SorterType from './graphql-sorter/types/sorter.type';
export declare class BaseService<T> implements BaseServiceInterface<T> {
    protected repository: Repository<T>;
    protected readonly logger: Logger;
    add(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    remove(id: number): Promise<void>;
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    findOneById(id: unknown): Promise<T>;
    findAllBy(where?: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>, order?: FindOptionsOrder<T>): Promise<T[]>;
    findOneBy(where?: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>, order?: FindOptionsOrder<T>): Promise<T>;
    findWithQueryBuilder(queries?: FiltersType[], sorters?: SorterType[], offset?: number, limit?: any, alias?: string): SelectQueryBuilder<T>;
}
