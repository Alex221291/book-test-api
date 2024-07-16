import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import CategoriesPaginatedResponse from './types/categories.paginate';
import { CategoriesEntity } from './categories.entity';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { CategoriesInput } from './categories.input';
import { NotFoundError } from 'rxjs';

@Resolver(() => CategoriesResolver)
export class CategoriesResolver {
	constructor(private readonly categoriesService: CategoriesService) {}

	@UseGuards(GqlAuthGuard)
	@Query(() => CategoriesPaginatedResponse)
	async getCategories(
		@Args('companyId') companyId: string,
		@Args('filters', {
			nullable: true,
			defaultValue: [{ operator: 'AND', filters: [] }] as FiltersExpression[],
			type: () => [FiltersExpression],
		})
		filters: FiltersExpression[],
		@Args('sorters', { nullable: true, type: () => [SorterType] })
		sorters?: SorterType[],
		@Args('offset', { type: () => Int, nullable: true }) offset?: number,
		@Args('limit', { type: () => Int, nullable: true }) limit?: number,
	): Promise<CategoriesPaginatedResponse> {
		const builder = this.categoriesService.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.services', 'services')
			.leftJoinAndSelect('e.company', 'company')
			.andWhere('e.archived is not TRUE')
			.andWhere(`company.hash = '${companyId}'`);
		const [data, count] = await builder.getManyAndCount();
		return new CategoriesPaginatedResponse(data, count, offset, limit);
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => CategoriesEntity)
	async getCategoryById(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('companyId') companyId: string,
	): Promise<CategoriesEntity> {
		return await this.categoriesService.findOneBy({
			id: id,
			archived: false,
			company: {
				hash: companyId,
				users: {
					id: user.id,
				},
			},
		});
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => CategoriesEntity)
	async updateCategory(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('entity') payload: CategoriesInput,
		@Args('companyId') companyId: string,
	): Promise<CategoriesEntity> {
		const category = await this.categoriesService.findOneBy({
			id: id,
			archived: false,
			company: {
				hash: companyId,
				users: {
					id: user.id,
				},
			},
		});
		if (category) {
			category.title = payload.title;
			return this.categoriesService.update(category);
		} else {
			throw new NotFoundError('Category not found');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => CategoriesEntity)
	async removeCategory(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('companyId') companyId: string,
	): Promise<CategoriesEntity> {
		const category = await this.categoriesService.findOneBy({
			id: id,
			archived: false,
			company: {
				hash: companyId,
				users: {
					id: user.id,
				},
			},
		});
		if (category) {
			category.archived = true;
			return this.categoriesService.update(category);
		} else {
			throw new NotFoundError('Category not found');
		}
	}
}
