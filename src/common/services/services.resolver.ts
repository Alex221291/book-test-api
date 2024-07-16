import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ServiceEntity } from './services.entity';
import { ServicesService } from './services.service';
import { ServiceInput } from './services.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { NotFoundError } from 'rxjs';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import ServicesPaginatedResponse from './types/services.paginate';
import { CompaniesService } from '../companies/companies.service';

@Resolver(() => ServiceEntity)
export class ServicesResolver {
	constructor(
		private servicesService: ServicesService,
		private companiesService: CompaniesService,
	) {}

	@Query(() => ServicesPaginatedResponse)
	async getAllServices(
		@Args('company') companyId: string,
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
		const builder = this.servicesService.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.company', 'company')
			.leftJoinAndSelect('e.employees', 'employees')
			.leftJoinAndSelect('e.tags', 'tags')
			.leftJoinAndSelect('e.category', 'category');
		builder
			.andWhere(`e.archived = FALSE`)
			.andWhere(`company.hash = '${companyId}'`);
		const [data, count] = await builder.getManyAndCount();
		return new ServicesPaginatedResponse(data, count, offset, limit);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ServiceEntity)
	async addService(
		@User() user: UserEntity,
		@Args('company') hash: string,
		@Args('entity') payload: ServiceInput,
	) {
		const company = await this.companiesService.getCompanyByUser(hash, user);
		if (company) {
			return this.servicesService.add(
				await this.servicesService.prepare(
					payload,
					new ServiceEntity(),
					company,
				),
			);
		} else {
			throw new NotFoundError('Company not found');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ServiceEntity)
	async updateService(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('entity') payload: ServiceInput,
	) {
		const service = await this.servicesService.getService({ id }, user.id);
		if (service) {
			return this.servicesService.update(
				await this.servicesService.prepare(payload, service, service.company),
			);
		}
		throw new NotFoundError('service.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ServiceEntity)
	async removeService(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
	) {
		const service = await this.servicesService.getService({ id }, user.id);
		if (service) {
			service.archived = true;
			service.webForms = [];
			return this.servicesService.update(service);
		}
		throw new NotFoundError('service.not.found');
	}

	@Query(() => ServiceEntity)
	async getServiceById(@Args('id', { type: () => Int }) id: number) {
		return this.servicesService.findOneBy({
			id: id,
		});
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ServiceEntity)
	async addServiceTag(
		@User() user: UserEntity,
		@Args('serviceId') serviceId: number,
		@Args('tagId') tagId: number,
	) {
		return this.servicesService.addTag(serviceId, tagId, user.id);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ServiceEntity)
	async removeServiceTag(
		@User() user: UserEntity,
		@Args('serviceId') serviceId: number,
		@Args('tagId') tagId: number,
	) {
		return this.servicesService.removeTag(serviceId, tagId, user.id);
	}
}
