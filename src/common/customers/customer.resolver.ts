import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerEntity } from './customer.entity';
import { CustomerService } from './customer.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import CustomerPaginatedResponse from './types/customer.paginate';
import { CustomerInput } from './customer.input';
import { NotFoundError } from 'rxjs';
import parsePhoneNumber from '../../base/utils/parsePhoneNumber';
import { CompaniesService } from '../companies/companies.service';
import { AuthRoleGuard } from '../../auth/auth.role.guard';
import { Roles } from '../../auth/auth.role.decorator';
import { RoleTypes } from '../users/users.role.enum';
import { classToPlain } from 'class-transformer';

@Resolver(() => CustomerEntity)
export class CustomerResolver {
	constructor(
		private customerService: CustomerService,
		private companiesService: CompaniesService,
	) {}

	@UseGuards(GqlAuthGuard)
	@Query(() => CustomerPaginatedResponse)
	async getCustomers(
		@User() user: UserEntity,
		@Args('company') company: string,
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
	): Promise<CustomerPaginatedResponse> {
		return this.customerService.getCustomers(
			filters,
			sorters,
			company,
			user,
			offset,
			limit,
		);
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => CustomerEntity)
	async getCustomer(@User() user: UserEntity, @Args('id') id: number) {
		const entity = await this.customerService.getCustomer({ id }, user.id);
		return classToPlain(entity, { groups: [user.role] });
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => CustomerEntity)
	async addCustomer(
		@User() user: UserEntity,
		@Args('entity') payload: CustomerInput,
		@Args('company') companyId: string,
	): Promise<CustomerEntity> {
		const customer = await this.customerService.getCustomer(
			{
				phone: parsePhoneNumber(payload.phone),
			},
			user.id,
		);
		if (!customer) {
			const entity = new CustomerEntity();
			const company = await this.companiesService.getCompanyByUser(
				companyId,
				user,
			);
			return await this.customerService.add(
				this.customerService.prepare(entity, payload, company),
			);
		} else {
			throw new NotFoundError('customer.already.exists');
		}
	}

	@UseGuards(GqlAuthGuard, AuthRoleGuard)
	@Roles(RoleTypes.OWNER, RoleTypes.ADMIN_EXTERNAL)
	@Mutation(() => CustomerEntity)
	async addCustomerTag(
		@User() user: UserEntity,
		@Args('customerId') customerId: number,
		@Args('tagId') tagId: number,
	) {
		return this.customerService.addTag(customerId, tagId, user.id);
	}

	@UseGuards(GqlAuthGuard, AuthRoleGuard)
	@Roles(RoleTypes.OWNER, RoleTypes.ADMIN_EXTERNAL)
	@Mutation(() => CustomerEntity)
	async removeCustomerTag(
		@User() user: UserEntity,
		@Args('customerId') customerId: number,
		@Args('tagId') tagId: number,
	) {
		return this.customerService.removeTag(customerId, tagId, user.id);
	}

	@UseGuards(GqlAuthGuard, AuthRoleGuard)
	@Roles(RoleTypes.OWNER, RoleTypes.ADMIN_EXTERNAL, RoleTypes.EMPLOYEE_EXTERNAL)
	@Mutation(() => CustomerEntity)
	async updateCustomer(
		@User() user: UserEntity,
		@Args('id') id: number,
		@Args('entity') payload: CustomerInput,
	): Promise<CustomerEntity> {
		const entity = await this.customerService.getCustomer({ id }, user.id);
		if (entity) {
			return await this.customerService.update(
				this.customerService.prepare(entity, payload),
			);
		}
		throw new NotFoundError('customer.not.found');
	}

	@UseGuards(GqlAuthGuard, AuthRoleGuard)
	@Roles(RoleTypes.OWNER)
	@Mutation(() => CustomerEntity)
	async removeCustomer(@User() user: UserEntity, @Args('id') id: number) {
		const entity = await this.customerService.getCustomer({ id }, user.id);
		if (entity) {
			entity.archived = true;
			return await this.customerService.update(entity);
		}
		throw new NotFoundError('customer.not.found');
	}
}
