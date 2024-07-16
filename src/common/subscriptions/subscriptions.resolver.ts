import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SubscriptionsEntity } from './subscriptions.entity';
import { SubscriptionsService } from './subscriptions.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { SubscriptionsInput } from './subscriptions.input';
import { CompaniesService } from '../companies/companies.service';
import { NotFoundError } from 'rxjs';
import { SubscriptionsPlanService } from './subscriptions.plan.service';
import { CustomerService } from '../customers/customer.service';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import SubscriptionsPaginatedResponse from './types/subscriptions.paginate';
import { BookingsService } from '../bookings/bookings.service';
import { AuthPlansGuard } from '../../auth/auth.plans.guard';
import { Plans } from '../../auth/auth.plans.decorator';
import { PlanTypes } from '../users/users.plan.enum';

@Resolver(() => SubscriptionsEntity)
@Plans(PlanTypes.MEDIUM, PlanTypes.PRO)
export class SubscriptionsResolver {
	constructor(
		private readonly subscriptionsService: SubscriptionsService,
		private readonly companiesService: CompaniesService,
		private readonly subscriptionPlanService: SubscriptionsPlanService,
		private readonly customerService: CustomerService,
		private readonly bookingsService: BookingsService,
	) {}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => SubscriptionsEntity)
	async addSubscription(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('payload') payload: SubscriptionsInput,
	) {
		const company = await this.companiesService.getCompanyByUser(
			companyId,
			user,
		);
		if (company) {
			const entity = new SubscriptionsEntity();
			return await this.subscriptionsService.add(
				await this.subscriptionsService.prepareEntity(
					payload,
					entity,
					company,
					user,
				),
			);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => SubscriptionsEntity)
	async updateSubscription(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('id', { type: () => Int }) id: number,
		@Args('payload') payload: SubscriptionsInput,
	) {
		const entity = await this.subscriptionsService.findOneBy({
			id,
			plan: {
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			}
		});
		if (entity) {
			return await this.subscriptionsService.update(
				await this.subscriptionsService.prepareEntity(
					payload,
					entity,
					entity.plan.company,
					user,
				),
			);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Query(() => SubscriptionsPaginatedResponse)
	async getSubscriptions(
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
	): Promise<SubscriptionsPaginatedResponse> {
		const builder = this.subscriptionsService.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.bookings', 'bookings')
			.leftJoinAndSelect('e.plan', 'plan')
			.leftJoinAndSelect('plan.services', 'services')
			.leftJoinAndSelect('e.customer', 'customer')
			.leftJoinAndSelect('customer.company', 'company')
			.leftJoinAndSelect('company.users', 'users')
			.andWhere(`users.id IN(${user.id})`)
			.andWhere(`company.hash = '${companyId}'`);
		const [data, count] = await builder.getManyAndCount();
		return new SubscriptionsPaginatedResponse(data, count, offset, limit);
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Query(() => [SubscriptionsEntity])
	async getSubscriptionsByOrderId(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('orderId', { type: () => Int }) orderId: number,
		@Args('customerPhone') customerPhone: string,
	): Promise<Array<SubscriptionsEntity>> {
		const order = await this.bookingsService.findOneBy(
			{
				id: orderId,
				office: {
					company: {
						hash: companyId,
						users: {
							id: user.id,
						},
					},
				},
			},
			{
				schedules: true,
			},
		);
		if (order) {
			const serviceIds = order.schedules
				?.map((item) => item.services.map((el) => el.id))
				.flat(1);
			return await this.subscriptionsService.findSubscriptionsByServicesIds(
				companyId,
				serviceIds,
				customerPhone,
				user.id,
			);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Query(() => SubscriptionsEntity)
	async getSubscription(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('id', { type: () => Int }) id: number,
	): Promise<SubscriptionsEntity> {
		return await this.subscriptionsService.findOneBy({
			id: id,
			plan: {
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			}
		});
	}
}
