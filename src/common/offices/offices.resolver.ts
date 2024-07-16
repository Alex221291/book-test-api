import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OfficesService } from './offices.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import OfficesPaginatedResponse from './types/offices.paginate';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import { OfficesEntity } from './offices.entity';
import { OfficesInput } from './offices.input';
import { CompaniesService } from '../companies/companies.service';
import { NotFoundError } from 'rxjs';
import parsePhoneNumber from '../../base/utils/parsePhoneNumber';

@Resolver(() => OfficesResolver)
export class OfficesResolver {
	constructor(
		private readonly officesService: OfficesService,
		private readonly companyService: CompaniesService,
	) {}

	@UseGuards(GqlAuthGuard)
	@Query(() => [OfficesEntity])
	async getMyOffices(@User() user: UserEntity) {
		const company = await this.companyService.findAllBy({
			users: {
				id: user.id,
			},
		});
		const ids = company.map(({ id }) => id);
		const builder = this.officesService.findWithQueryBuilder();
		builder
			.leftJoinAndSelect('e.company', 'company')
			.leftJoinAndSelect('e.employees', 'employees')
			.leftJoinAndSelect('employees.services', 'services')
			.leftJoinAndSelect('employees.photo', 'photo')
			.where('company.id IN (:ids)', { ids })
			.andWhere('e.archived = false');
		return await builder.getMany();
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => OfficesPaginatedResponse)
	async getOffices(
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
	): Promise<OfficesPaginatedResponse> {
		const builder = this.officesService.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.company', 'company')
			.leftJoinAndSelect('company.users', 'users')
			.leftJoinAndSelect('e.employees', 'employees');
		builder
			.andWhere(`e.archived = FALSE`)
			.andWhere(`company.hash = '${companyId}'`)
			.andWhere(`users.id IN(${user.id})`);
		const [data, count] = await builder.getManyAndCount();
		return new OfficesPaginatedResponse(data, count, offset, limit);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => OfficesEntity)
	async addOffice(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('payload') payload: OfficesInput,
	): Promise<OfficesEntity> {
		const company = await this.companyService.getCompanyByUser(companyId, user);
		if (company) {
			const entity = new OfficesEntity();
			entity.title = payload.title;
			entity.address = payload.address;
			entity.company = company;
			entity.phone = parsePhoneNumber(payload.phone);
			entity.workingDays = payload.workingDays;
			return this.officesService.add(entity);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => OfficesEntity)
	async updateOffice(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('companyId') companyId: string,
		@Args('payload') payload: OfficesInput,
	): Promise<OfficesEntity> {
		const entity = await this.officesService.findOneBy({
			id,
			archived: false,
			company: {
				hash: companyId,
				users: {
					id: user.id,
				},
			},
		});
		if (entity) {
			entity.title = payload.title;
			entity.address = payload.address;
			entity.phone = parsePhoneNumber(payload.phone);
			entity.workingDays = payload.workingDays;
			return this.officesService.update(entity);
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => OfficesEntity)
	async removeOffice(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
	): Promise<OfficesEntity> {
		const entity = await this.officesService.findOneBy({
			id,
			archived: false,
			company: {
				users: {
					id: user.id,
				},
			},
		});
		if (entity) {
			entity.archived = true;
			try {
				return await this.officesService.update(entity);
			} catch (e) {
				throw new Error(e.message);
			}
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => OfficesEntity)
	async getOffice(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('companyId') companyId: string,
	): Promise<OfficesEntity> {
		return await this.officesService.findOneBy({
			id,
			archived: false,
			company: {
				hash: companyId,
				users: {
					id: user.id,
				},
			},
		});
	}
}
