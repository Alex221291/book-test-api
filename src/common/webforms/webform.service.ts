import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { WebFormEntity } from './webform.entity';
import { WebFormInput } from './webform.input';
import { OfficesService } from '../offices/offices.service';
import { EmployeesService } from '../employees/employees.service';
import { ServicesService } from '../services/services.service';
import { UserEntity } from '../users/users.entity';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import WebFormPaginatedResponse from './types/webform.paginate';

@Injectable()
export class WebFormService extends BaseService<WebFormEntity> {
	constructor(
		@InjectRepository(WebFormEntity)
		protected readonly repository: Repository<WebFormEntity>,
		private readonly officesService: OfficesService,
		private readonly employeesService: EmployeesService,
		private readonly servicesService: ServicesService,
	) {
		super();
	}

	async prepare(entity: WebFormEntity, payload: WebFormInput, userId: number) {
		const webFormEntity = this.repository.merge(entity, payload);
		webFormEntity.office = await this.officesService.findOneBy({
			id: payload.officeId,
			company: {
				users: {
					id: userId,
				},
			},
		});
		webFormEntity.employees = await Promise.all(
			payload.employeeIds.map(async (id) =>
				this.employeesService.findOneBy({
					id,
					office: {
						company: {
							users: {
								id: userId,
							},
						},
					},
				}),
			),
		);
		webFormEntity.services = await Promise.all(
			payload.serviceIds.map(async (id) =>
				this.servicesService.findOneBy({
					id,
					company: {
						users: {
							id: userId,
						},
					},
				}),
			),
		);
		return webFormEntity;
	}

	async getWebFormList(
		userIds: number[],
		companyId: string,
		filters: FiltersExpression[],
		sorters?: SorterType[],
		offset?: number,
		limit?: number,
	) {
		const builder = this.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.office', 'office')
			.leftJoinAndSelect('office.company', 'company')
			.leftJoinAndSelect('company.users', 'users')
			.andWhere('e.archived is FALSE')
			.andWhere(`company.hash = :companyId`, { companyId })
			.andWhere(`users.id IN(:userIds)`, { userIds });
		const [data, count] = await builder.getManyAndCount();
		return new WebFormPaginatedResponse(data, count, offset, limit);
	}

	async getWebFormByHash(hash: string) {
		const entity = await this.findOneBy(
			{
				hash,
				archived: false,
			},
			{
				office: {
					company: {
						logo: true,
					},
				},
				services: true,
				employees: {
					photo: true,
				},
			},
		);
		if (!entity) {
			throw new NotFoundException('entity.not.found');
		}
		return entity;
	}

	async getWebForm(where: FindOptionsWhere<WebFormEntity>, user: UserEntity) {
		const entity = await this.findOneBy(
			{
				...where,
				archived: false,
				office: {
					company: {
						users: {
							id: user.id,
						},
					},
				},
			},
			{
				office: {
					company: {
						logo: true,
					},
				},
				services: true,
				employees: true,
			},
		);
		if (!entity) {
			throw new NotFoundException('entity.not.found');
		}
		return entity;
	}
}
