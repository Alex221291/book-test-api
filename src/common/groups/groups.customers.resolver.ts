import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GroupsCustomersEntity } from './groups.customers.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { GroupsCustomersService } from './groups.customers.service';
import { CompaniesService } from '../companies/companies.service';
import { GroupsService } from './groups.service';
import { GroupsCustomersInput } from './groups.customers.input';
import { CustomerService } from '../customers/customer.service';
import { NotFoundError } from 'rxjs';

@Resolver(() => GroupsCustomersEntity)
export class GroupsCustomersResolver {
	constructor(
		private readonly groupService: GroupsService,
		private readonly companiesService: CompaniesService,
		private readonly groupsCustomersService: GroupsCustomersService,
		private readonly customerService: CustomerService,
	) {}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => GroupsCustomersEntity)
	async addCustomerToGroup(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('payload') payload: GroupsCustomersInput,
	): Promise<GroupsCustomersEntity> {
		const company = await this.companiesService.getCompanyByUser(
			companyId,
			user,
		);
		if (company) {
			const entity = new GroupsCustomersEntity();
			entity.group = await this.groupService.findOneBy({
				id: payload.group,
				office: {
					company: {
						hash: companyId,
						users: {
							id: user.id,
						},
					},
				},
			});
			entity.customer = await this.customerService.findOneBy({
				id: payload.customer,
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			});
			return this.groupsCustomersService.add(entity);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => GroupsCustomersEntity)
	async updateGroupCustomer(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('companyId') companyId: string,
		@Args('payload') payload: GroupsCustomersInput,
	) {
		const entity = await this.groupsCustomersService.findOneBy({
			id: id,
			customer: {
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			},
		});
		if (entity) {
			entity.group = await this.groupService.findOneBy({
				id: payload.group,
				office: {
					company: {
						hash: companyId,
						users: {
							id: user.id,
						},
					},
				},
			});
			entity.customer = await this.customerService.findOneBy({
				id: payload.customer,
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			});
			return this.groupsCustomersService.update(entity);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => Boolean)
	async removeCustomerFromGroup(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('id') id: number,
	): Promise<boolean> {
		const entity = await this.groupsCustomersService.findOneBy({
			id,
			customer: {
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			},
		});
		if (entity) {
			await this.groupsCustomersService.remove(id);
			return true;
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}
}
