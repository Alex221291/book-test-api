import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { CustomerEntity } from './customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CustomerInput } from './customer.input';
import { CompanyEntity } from '../companies/companies.entity';
import { TagsService } from '../tags/tags.service';
import CustomerPaginatedResponse from './types/customer.paginate';
import { classToPlain } from 'class-transformer';
import { UserEntity } from '../users/users.entity';
import FiltersType from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';

@Injectable()
export class CustomerService extends BaseService<CustomerEntity> {
	constructor(
		@InjectRepository(CustomerEntity)
		protected repository: Repository<CustomerEntity>,
		private readonly tagsService: TagsService,
	) {
		super();
	}

	prepare(
		entity: CustomerEntity,
		payload: CustomerInput,
		company?: CompanyEntity,
	) {
		return this.repository.merge(entity, { ...payload, company });
	}

	async getCustomers(
		filters: FiltersType[] = [{ operator: 'AND', filters: [] }],
		sorters: SorterType[] = [],
		companyId: string,
		user: UserEntity,
		offset = 0,
		limit = null,
	) {
		const builder = this.findWithQueryBuilder(filters, sorters, offset, limit);
		builder
			.leftJoinAndSelect('e.company', 'company')
			.leftJoinAndSelect('company.users', 'users')
			.leftJoinAndSelect('e.bookings', 'bookings')
			.leftJoinAndSelect('e.tags', 'tags')
			.andWhere(`users.id IN(:userIds)`, { userIds: [user.id] })
			.andWhere(`company.hash = :companyId`, { companyId })
			.andWhere('e.archived = :archived', { archived: false });
		const [data, count] = await builder.getManyAndCount();
		return new CustomerPaginatedResponse(
			classToPlain(data, { groups: [user.role] }),
			count,
			offset,
			limit,
		);
	}

	async getCustomer(where: FindOptionsWhere<CustomerEntity>, userId: number) {
		return await this.findOneBy(
			{
				...where,
				archived: false,
				company: {
					users: {
						id: userId,
					},
				},
			},
			{
				bookings: true,
				tags: true,
			},
		);
	}

	async addTag(customerId: number, tagId: number, userId: number) {
		const entity = await this.getCustomer({ id: customerId }, userId);
		const tag = await this.tagsService.getTag(tagId, userId);
		if (entity) {
			if (tag) {
				entity.tags = [...entity.tags, tag];
				return this.repository.save(entity);
			}
			throw new NotFoundException('tag.not.found');
		}
		throw new NotFoundException('customer.not.found');
	}

	async removeTag(customerId: number, tagId: number, userId: number) {
		const entity = await this.getCustomer({ id: customerId }, userId);
		if (entity) {
			entity.tags = entity.tags.filter(({ id }) => id !== tagId);
			return this.repository.save(entity);
		}
		throw new NotFoundException('customer.not.found');
	}
}
