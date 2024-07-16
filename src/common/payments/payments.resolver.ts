import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import PaymentsPaginatedResponse from './types/PaymentsPaginatedResponse';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';

@Resolver(() => PaymentsResolver)
export class PaymentsResolver {
	constructor(private readonly paymentsService: PaymentsService) {}

	@UseGuards(GqlAuthGuard)
	@Query(() => PaymentsPaginatedResponse)
	public async getPayments(
		@User() user: UserEntity,
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
		const builder = this.paymentsService.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.user', 'user')
			.andWhere(`user.id = ${user.id}`);
		const [data, count] = await builder.getManyAndCount();
		return new PaymentsPaginatedResponse(data, count, offset, limit);
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => String)
	public async getBalance(
		@User() user: UserEntity,
		@Args('account') account: string,
	) {
		const payment = await this.paymentsService.findOneBy(
			{
				account_key: account,
				user: {
					id: user.id,
				},
			},
			{},
			{ id: 'desc' },
		);
		return payment?.balance || '0.00';
	}
}
