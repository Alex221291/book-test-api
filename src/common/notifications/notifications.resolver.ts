import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NotificationsEntity } from './notifications.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { NotificationsService } from './notifications.service';
import { NotFoundError } from 'rxjs';

@SkipThrottle()
@Resolver(() => NotificationsEntity)
export class NotificationsResolver {
	constructor(
		@Inject('PUB_SUB') private readonly pubSub: PubSub,
		private readonly notificationsService: NotificationsService,
	) {}

	@Subscription(() => NotificationsEntity, {
		filter: (payload, variables) => {
			return payload.notificationAdded.company.hash === variables.company;
		},
	})
	notificationAdded(@Args('company') company: string) {
		return this.pubSub.asyncIterator('notificationAdded');
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => [NotificationsEntity])
	getNotifications(@User() user: UserEntity, @Args('company') company: string) {
		return this.notificationsService.findAllBy(
			{
				company: {
					hash: company,
					users: {
						id: user.id,
					},
				},
			},
			{},
			{ read: 'ASC', createdAt: 'desc' },
		);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => NotificationsEntity)
	async readNotification(@User() user: UserEntity, @Args('id') id: number) {
		const entity = await this.notificationsService.findOneBy({
			id,
			company: {
				users: {
					id: user.id,
				},
			},
		});
		if (entity) {
			entity.read = true;
			return await this.notificationsService.update(entity);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}
}
