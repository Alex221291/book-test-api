import { AuthService } from './auth.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthModel } from './auth.model';
import { UserEntity } from '../common/users/users.entity';
import { UsersService } from '../common/users/users.service';
import { CompaniesService } from '../common/companies/companies.service';
import { GqlAuthGuard } from './gql-auth.guard';
import { User } from './user.decorator';
import { CompanyInput } from '../common/companies/companies.input';
import { CompanyEntity } from '../common/companies/companies.entity';
import { NotFoundError } from 'rxjs';
import generateHash from '../base/utils/generateHash';
import md5 from '../base/utils/md5';
import parsePhoneNumber from '../base/utils/parsePhoneNumber';
import { UsersStatus } from '../common/users/users.status.enum';
import { PlansService } from '../common/plans/plans.services';
import { generateRandomCode } from '../base/utils/generateRandomCode';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsService } from '../common/notifications/notifications.service';

@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
		private readonly companyService: CompaniesService,
		private readonly plansService: PlansService,
		private readonly notificationsService: NotificationsService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	@Mutation(() => AuthModel)
	async login(
		@Args('email', { type: () => String }) email: string,
		@Args('password', { type: () => String }) password: string,
	) {
		const user = await this.authService.validateUser(email, password);
		if (user) {
			return this.authService.login(user);
		} else {
			throw new UnauthorizedException();
		}
	}

	@Mutation(() => AuthModel)
	async register(
		@Args('phone', { type: () => String }) phone: string,
		@Args('password', { type: () => String }) password: string,
	) {
		const entity = new UserEntity(phone, password);
		entity.plan = await this.plansService.findOneBy({
			code: 'FREE',
		});
		const user = await this.userService.add(entity);
		return this.authService.login(user);
	}

	@Mutation(() => UserEntity)
	async confirmEmail(@Args('hash') hash: string) {
		const user = await this.userService.findOneBy({
			hash,
			confirmed: false,
		});
		if (user) {
			user.confirmed = true;
			return this.userService.update(user);
		} else {
			throw new NotFoundError('User not found');
		}
	}

	@Mutation(() => Boolean)
	async resetPasswordRequest(@Args('phone') phone: string) {
		const user = await this.userService.findOneBy({
			phone,
		});
		if (user) {
			user.hash = generateRandomCode().toString();
			await this.userService.update(user);
			this.notificationsService.sendSMS(user.phone, `PIN: ${user.hash}`);
			return true;
		} else {
			throw new NotFoundError('User not found');
		}
	}

	@Mutation(() => Boolean)
	async changePasswordByResettingHash(
		@Args('code') code: string,
		@Args('password') password: string,
	) {
		const user = await this.userService.findOneBy({
			hash: code,
		});
		if (user) {
			user.hash = generateHash();
			user.password = md5(password);
			await this.userService.update(user);
			return true;
		} else {
			throw new NotFoundError('User not found');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => AuthModel)
	async onBoarding(
		@User() user: UserEntity,
		@Args('entity') payload: CompanyInput,
	) {
		const entity = new CompanyEntity();
		entity.users = [user];
		entity.users = [user];
		entity.address = payload.address;
		entity.phone = parsePhoneNumber(payload.phone);
		entity.title = payload.title;
		entity.description = payload.description;
		entity.regNumber = payload.regNumber;
		entity.timezone = payload.timezone;
		const company = await this.companyService.add(entity);
		if (company.id) {
			const entity = await this.userService.findOneBy(
				{ id: user.id },
				{
					companies: true,
				},
			);
			entity.status = UsersStatus.COMPLETED;
			await this.userService.update(entity);
			return this.authService.login(entity);
		}
	}
}
