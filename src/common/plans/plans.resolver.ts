import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlansService } from './plans.services';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { PlansEntity } from './plans.entity';
import { UsersService } from '../users/users.service';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { DateTime } from 'luxon';
import date from '../../base/utils/date';

@Resolver(() => PlansResolver)
export class PlansResolver {
	constructor(
		private readonly plansService: PlansService,
		private readonly usersService: UsersService,
	) {}

	@UseGuards(GqlAuthGuard)
	@Query(() => [PlansEntity])
	async getPlans() {
		return await this.plansService.findAll();
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => UserEntity)
	async upgradePlan(@User() user: UserEntity, @Args('code') code: string) {
		const plan = await this.plansService.findOneBy({ code });
		if (plan) {
			const currentUser = await this.usersService.findOneBy({ id: user.id });
			const price = plan.profit * plan.ordersLimit;
			if (Number(currentUser.balance) < price) {
				throw new ForbiddenException('low.user.balance');
			}
			if (currentUser.plan.level > plan.level) {
				throw new ForbiddenException('downgrade.forbidden');
			}
			currentUser.plan = plan;
			currentUser.startOf = date().toJSDate();
			return await this.usersService.update(currentUser);
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => UserEntity)
	async downgradePlan(@User() user: UserEntity, @Args('code') code: string) {
		const plan = await this.plansService.findOneBy({ code });
		const currentUser = await this.usersService.findOneBy({ id: user.id });
		if (plan && currentUser.plan.level > plan.level) {
			currentUser.plan = plan;
			currentUser.startOf = date().toJSDate();
			return await this.usersService.update(currentUser);
		}
	}
}
