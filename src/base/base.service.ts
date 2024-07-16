import {
	Brackets,
	FindManyOptions,
	FindOptionsOrder,
	FindOptionsRelations,
	FindOptionsWhere,
	Repository,
	SelectQueryBuilder,
} from 'typeorm';
import { BaseServiceInterface } from './base.service.interface';
import FiltersType from './graphql-filter/types/filters.type';
import { Logger } from '@nestjs/common';
import SorterType from './graphql-sorter/types/sorter.type';
import makeWhereString from './graphql-filter/utils/makeWhereString';
import makeSqlProperty from './graphql-filter/utils/makeSqlProperty';

export class BaseService<T> implements BaseServiceInterface<T> {
	protected repository: Repository<T>;
	protected readonly logger = new Logger(BaseService.name);

	add(entity: T): Promise<T> {
		return this.repository.save(entity);
	}

	update(entity: T): Promise<T> {
		return this.repository.save(entity);
	}

	async remove(id: number): Promise<void> {
		await this.repository.delete(id);
	}

	findAll(options?: FindManyOptions<T>): Promise<T[]> {
		return this.repository.find(options);
	}

	findOneById(id: unknown): Promise<T> {
		return this.repository.findOne(id);
	}

	findAllBy(
		where: FindOptionsWhere<T> = {},
		relations: FindOptionsRelations<T> = {},
		order: FindOptionsOrder<T> = {},
	): Promise<T[]> {
		return this.repository.find({ where, relations, order });
	}

	findOneBy(
		where: FindOptionsWhere<T> = {},
		relations: FindOptionsRelations<T> = {},
		order: FindOptionsOrder<T> = {},
	): Promise<T> {
		return this.repository.findOne({ where, relations, order });
	}

	findWithQueryBuilder(
		queries: FiltersType[] = [{ operator: 'AND', filters: [] }],
		sorters: SorterType[] = [],
		offset = 0,
		limit = null,
		alias = 'e',
	): SelectQueryBuilder<T> {
		const builder = this.repository.createQueryBuilder(alias);
		for (const query of queries) {
			const { filters, operator: op } = query;
			builder.andWhere(
				new Brackets((qb) => {
					for (const filter of filters) {
						const { values = [], comparator = '=' } = filter;
						if (values.length > 0) {
							const str = makeWhereString(
								filter.field,
								comparator,
								values,
								alias,
							);
							if (op === 'AND') {
								qb.andWhere(str);
							} else if (op === 'OR') {
								qb.orWhere(str);
							} else {
								qb.where(str);
							}
						}
					}
				}),
			);
		}
		for (const filter of sorters) {
			builder.addOrderBy(
				makeSqlProperty(alias, filter.column),
				filter.direction,
			);
		}
		builder.addOrderBy('e.id', 'DESC');

		builder.skip(offset);
		if (limit) {
			builder.take(limit);
		}
		return builder;
	}
}
