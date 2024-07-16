import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GroupsEntity } from './groups.entity';
import { GroupsService } from './groups.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { GroupsInput } from './groups.input';
import { CompaniesService } from '../companies/companies.service';
import { NotFoundError } from 'rxjs';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import GroupsPaginatedResponse from './types/groups.paginate';
import { ServicesService } from '../services/services.service';
import { OfficesService } from '../offices/offices.service';
import { AuthPlansGuard } from '../../auth/auth.plans.guard';
import { Plans } from '../../auth/auth.plans.decorator';
import { PlanTypes } from '../users/users.plan.enum';

@Resolver(() => GroupsEntity)
@Plans(PlanTypes.MEDIUM, PlanTypes.PRO)
export class GroupsResolver {
	constructor(
		private readonly groupService: GroupsService,
		private readonly companiesService: CompaniesService,
		private readonly serviceService: ServicesService,
		private readonly officesService: OfficesService,
	) {}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => GroupsEntity)
	async addGroup(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('payload') payload: GroupsInput,
	) {
		const company = await this.companiesService.getCompanyByUser(
			companyId,
			user,
		);
		if (company) {
			const entity = new GroupsEntity();
			entity.title = payload.title;
			entity.sinceDate = payload.sinceDate;
			entity.untilDate = payload.untilDate;
			entity.service = await this.serviceService.findOneBy({
				id: payload.serviceId,
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			});
			entity.office = await this.officesService.findOneBy({
				id: payload.officeId,
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			});
			return await this.groupService.add(entity);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => GroupsEntity)
	async updateGroup(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('id', { type: () => Int }) id: number,
		@Args('payload') payload: GroupsInput,
	) {
		const group = await this.groupService.findOneBy({
			id: id,
			archived: false,
			office: {
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			},
		});
		if (group) {
			group.title = payload.title;
			group.sinceDate = payload.sinceDate;
			group.untilDate = payload.untilDate;
			group.service = await this.serviceService.findOneBy({
				id: payload.serviceId,
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			});
			group.office = await this.officesService.findOneBy({
				id: payload.officeId,
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			});
			return await this.groupService.update(group);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => GroupsEntity)
	async removeGroup(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('id', { type: () => Int }) id: number,
	): Promise<GroupsEntity> {
		const group = await this.groupService.findOneBy({
			id: id,
			archived: false,
			office: {
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			},
		});
		if (group) {
			group.archived = true;
			return await this.groupService.update(group);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Query(() => GroupsEntity)
	async getGroup(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('id', { type: () => Int }) id: number,
	): Promise<GroupsEntity> {
		return await this.groupService.findOneBy(
			{
				id: id,
				archived: false,
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
				customers: {
					customer: true,
				},
				schedules: {
					employee: true,
				},
				service: true,
				office: true,
			},
		);
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Query(() => GroupsPaginatedResponse)
	async getGroups(
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
	): Promise<GroupsPaginatedResponse> {
		const builder = this.groupService.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.office', 'office')
			.leftJoinAndSelect('e.service', 'service')
			.leftJoinAndSelect('e.customers', 'customers')
			.leftJoinAndSelect('e.schedules', 'schedules')
			.leftJoinAndSelect('schedules.employee', 'employee')
			.leftJoinAndSelect('office.company', 'company')
			.leftJoinAndSelect('company.users', 'users')
			.andWhere(`e.archived is FALSE`)
			.andWhere(`users.id IN(${user.id})`)
			.andWhere(`company.hash = '${companyId}'`);
		const [data, count] = await builder.getManyAndCount();
		return new GroupsPaginatedResponse(data, count, offset, limit);
	}
}
