import { UserEntity } from './users.entity';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserInput } from './users.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { NotFoundError } from 'rxjs';
import md5 from '../../base/utils/md5';
import parsePhoneNumber from '../../base/utils/parsePhoneNumber';

@Resolver(() => UserEntity)
export class UsersResolver {
	constructor(private userService: UsersService) {}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => Boolean)
	async sendConfirmationLink(@User() user: UserEntity) {
		const entity = await this.userService.findOneBy({ id: user.id });
		if (!entity.confirmed) {
			// todo
			return true;
		} else {
			throw new NotFoundError('User not found');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => UserEntity)
	async getUser(@User() user: UserEntity) {
		return this.userService.findOneBy(
			{ id: user.id },
			{
				companies: true,
				employees: {
					photo: true,
					background: true,
					office: {
						company: true,
					},
				},
			},
		);
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => [UserEntity])
	async getAllUsers() {
		return this.userService.findAll();
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => UserEntity)
	async addUser(@Args('entity') entity: UserInput) {
		return this.userService.add(entity as UserEntity);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => UserEntity)
	async updateUser(
		@User() user: UserEntity,
		@Args('entity') entity: UserInput,
	) {
		const payload = await this.userService.findOneBy({
			id: user.id,
		});
		if (entity.email?.length > 0) {
			payload.email = entity.email;
		}
		payload.phone = parsePhoneNumber(entity.phone);
		payload.birthday = entity.birthday;
		return this.userService.update(payload);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => UserEntity)
	async changePassword(
		@User() user: UserEntity,
		@Args('password') password: string,
		@Args('newPassword') newPassword: string,
	) {
		const entity = await this.userService.findOneBy({
			id: user.id,
			password: md5(password),
		});
		if (entity) {
			entity.password = md5(newPassword);
			return this.userService.update(entity);
		} else {
			throw new NotFoundError('Something went wrong. Try again. :(');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => UserEntity)
	async removeUser(@Args('id', { type: () => Int }) id: number) {
		return this.userService.remove(id);
	}
}
