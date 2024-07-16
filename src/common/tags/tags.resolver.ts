import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagsEntity } from './tags.entity';
import { TagsService } from './tags.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { TagsInput } from './tags.input';
import { CompaniesService } from '../companies/companies.service';
import TagsPaginatedResponse from './types/tags.paginate';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';

@Resolver(() => TagsEntity)
export class TagsResolver {
	constructor(
		private readonly tagsService: TagsService,
		private readonly companiesService: CompaniesService,
	) {}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => TagsEntity)
	async addTag(
		@User() user: UserEntity,
		@Args('company') companyId: string,
		@Args('payload') payload: TagsInput,
	) {
		const company = await this.companiesService.getCompanyByUser(
			companyId,
			user,
		);
		if (company) {
			const entity = new TagsEntity();
			return await this.tagsService.add(
				await this.tagsService.prepare(entity, payload, company),
			);
		}
		throw new NotFoundException('company.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => TagsEntity)
	async updateTag(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('company') companyId: string,
		@Args('payload') payload: TagsInput,
	) {
		const company = await this.companiesService.getCompanyByUser(
			companyId,
			user,
		);
		if (company) {
			const entity = await this.tagsService.getTag(id, user.id);
			if (entity) {
				return await this.tagsService.update(
					await this.tagsService.prepare(entity, payload, company),
				);
			}
			throw new NotFoundException('tag.not.found');
		}
		throw new NotFoundException('company.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => Boolean)
	async removeTag(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('company') companyId: string,
	) {
		const company = await this.companiesService.getCompanyByUser(
			companyId,
			user,
		);
		if (company) {
			const entity = await this.tagsService.getTag(id, user.id);
			if (entity) {
				await this.tagsService.remove(entity.id);
				return true;
			}
			throw new NotFoundException('tag.not.found');
		}
		throw new NotFoundException('company.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => TagsPaginatedResponse)
	async getTags(
		@User() user: UserEntity,
		@Args('company') companyId: string,
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
	) {
		const builder = this.tagsService.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.company', 'company')
			.andWhere('company.hash = :hash', { hash: companyId });
		const [data, count] = await builder.getManyAndCount();
		return new TagsPaginatedResponse(data, count, offset, limit);
	}
}
