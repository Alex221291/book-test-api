import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SubscriptionsPlanEntity } from './subscriptions.plan.entity';
import { SubscriptionsPlanService } from './subscriptions.plan.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { SubscriptionsPlanInput } from './subscriptions.plan.input';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { CompaniesService } from '../companies/companies.service';
import { ServicesService } from '../services/services.service';
import { NotFoundError } from 'rxjs';
import SubscriptionsPlanPaginatedResponse from './types/subscriptions.plan.paginate';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import { CompanyEntity } from '../companies/companies.entity';
import { AuthPlansGuard } from '../../auth/auth.plans.guard';
import { Plans } from '../../auth/auth.plans.decorator';
import { PlanTypes } from '../users/users.plan.enum';

@Resolver(() => SubscriptionsPlanEntity)
@Plans(PlanTypes.MEDIUM, PlanTypes.PRO)
export class SubscriptionsPlanResolver {
	constructor(
		private readonly subscriptionsPlanService: SubscriptionsPlanService,
		private readonly companiesService: CompaniesService,
		private readonly servicesService: ServicesService,
	) {}

	private async prepareEntity(
		entity: SubscriptionsPlanEntity,
		payload: SubscriptionsPlanInput,
		company?: CompanyEntity,
	) {
		if (company) {
			entity.company = company;
		}
		entity.title = payload.title;
		entity.price = payload.price;
		entity.validity = payload.validity;
		entity.unit = payload.unit;
		entity.activationType = payload.activationType;
		entity.visits = payload.visits;
		entity.currency = payload.currency;
		entity.services = await Promise.all(
			payload.serviceIds.map(
				async (id) =>
					await this.servicesService.findOneBy({
						company: {
							id: company?.id || entity.company?.id,
						},
						id: id,
					}),
			),
		);
		return entity;
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => SubscriptionsPlanEntity)
	async addSubscriptionPlan(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('payload') payload: SubscriptionsPlanInput,
	) {
		const company = await this.companiesService.getCompanyByUser(
			companyId,
			user,
		);
		if (company) {
			const entity = new SubscriptionsPlanEntity();
			return await this.subscriptionsPlanService.add(
				await this.prepareEntity(entity, payload, company),
			);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => SubscriptionsPlanEntity)
	async updateSubscriptionPlan(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('payload') payload: SubscriptionsPlanInput,
		@Args('id', { type: () => Int }) id: number,
	) {
		const entity = await this.subscriptionsPlanService.getSubscriptionsPlanById(
			user.id,
			companyId,
			id,
		);
		if (entity) {
			return await this.subscriptionsPlanService.update(
				await this.prepareEntity(entity, payload),
			);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Query(() => SubscriptionsPlanPaginatedResponse)
	async getSubscriptionPlans(
		@User() user: UserEntity,
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
	): Promise<SubscriptionsPlanPaginatedResponse> {
		const builder = this.subscriptionsPlanService.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.company', 'company')
			.leftJoinAndSelect('e.services', 'service')
			.leftJoinAndSelect('company.users', 'users')
			.andWhere(`e.archived is FALSE`)
			.andWhere(`users.id IN(${user.id})`)
			.andWhere(`company.hash = '${companyId}'`);
		const [data, count] = await builder.getManyAndCount();
		return new SubscriptionsPlanPaginatedResponse(data, count, offset, limit);
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Query(() => SubscriptionsPlanEntity)
	async getSubscriptionPlan(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('id', { type: () => Int }) id: number,
	): Promise<SubscriptionsPlanEntity> {
		return await this.subscriptionsPlanService.getSubscriptionsPlanById(
			user.id,
			companyId,
			id,
		);
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => SubscriptionsPlanEntity)
	async removeSubscriptionPlan(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('id', { type: () => Int }) id: number,
	): Promise<SubscriptionsPlanEntity> {
		const entity = await this.subscriptionsPlanService.getSubscriptionsPlanById(
			user.id,
			companyId,
			id,
		);
		if (entity) {
			entity.archived = true;
			return this.subscriptionsPlanService.update(entity);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}
}
