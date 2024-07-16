import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import { WebFormService } from './webform.service';
import { WebFormEntity } from './webform.entity';
import WebFormPaginatedResponse from './types/webform.paginate';
import { WebFormInput } from './webform.input';
import { EmployeesService } from '../employees/employees.service';

@Resolver(() => WebFormResolver)
export class WebFormResolver {
	constructor(
		private readonly service: WebFormService,
		@Inject(forwardRef(() => EmployeesService))
		private readonly employeesService: EmployeesService,
	) {}

	@UseGuards(GqlAuthGuard)
	@Query(() => WebFormPaginatedResponse)
	async getAllWebForms(
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
		return this.service.getWebFormList([user.id], companyId, filters, sorters, offset, limit)
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => WebFormEntity)
	async getWebFormById(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
	): Promise<WebFormEntity> {
		return await this.service.getWebForm({ id }, user);
	}

	@Query(() => WebFormEntity)
	async getWebForm(@Args('hash') hash: string): Promise<WebFormEntity> {
		return await this.service.getWebFormByHash(hash);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => WebFormEntity)
	async addWebForm(
		@User() user: UserEntity,
		@Args('payload') payload: WebFormInput,
	) {
		return this.service.add(
			await this.service.prepare(new WebFormEntity(), payload, user.id),
		);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => WebFormEntity)
	async updateWebForm(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('payload') payload: WebFormInput,
	) {
		return this.service.update(
			await this.service.prepare(
				await this.service.getWebForm({ id }, user),
				payload,
				user.id,
			),
		);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => WebFormEntity)
	async removeWebForm(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
	) {
		return await this.service.getWebForm({ id }, user);
	}
}
