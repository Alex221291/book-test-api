import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceEntity } from './services.entity';
import {
	Brackets,
	FindManyOptions,
	FindOptionsWhere,
	Repository,
} from 'typeorm';
import { BaseService } from '../../base/base.service';
import { ServiceInput } from './services.input';
import { CompanyEntity } from '../companies/companies.entity';
import { CategoriesEntity } from '../categories/categories.entity';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class ServicesService extends BaseService<ServiceEntity> {
	constructor(
		@InjectRepository(ServiceEntity)
		protected repository: Repository<ServiceEntity>,
		private readonly categoriesService: CategoriesService,
		private readonly tagsService: TagsService,
	) {
		super();
	}

	async prepare(
		payload: ServiceInput,
		entity: ServiceEntity,
		company: CompanyEntity,
	): Promise<ServiceEntity> {
		entity.title = payload.title;
		entity.description = payload.description;
		entity.duration = payload.duration;
		entity.price = payload.price;
		entity.currency = payload.currency;
		entity.company = company;
		entity.maxPrice = payload.maxPrice;
		entity.weight = payload.weight;
		if (payload.category) {
			entity.category = await this.categoriesService.findOneBy({
				title: payload.category.toLowerCase(),
				company: {
					hash: company.hash,
				},
			});
			if (!entity.category) {
				const category = new CategoriesEntity();
				category.title = payload.category.toLowerCase();
				category.company = company;
				entity.category = category;
			}
		} else {
			entity.category = null;
		}
		return entity;
	}

	async getService(where: FindOptionsWhere<ServiceEntity>, userId: number) {
		return await this.findOneBy(
			{
				...where,
				//archived: false,
				company: {
					users: {
						id: userId,
					},
				},
			},
			{
				tags: true,
			},
		);
	}

	findAll(options?: FindManyOptions<ServiceEntity>): Promise<ServiceEntity[]> {
		return super.findAll({
			...options,
		});
	}

	findServicesByIds(
		employeeIds: number[],
		serviceIds: number[],
	): Promise<ServiceEntity[]> {
		const builder = this.repository.createQueryBuilder('e');
		builder
			.leftJoin('e.company', 'company')
			.leftJoinAndSelect('e.employees', 'employees')
			.andWhere(`e.id IN(:serviceIds)`, { serviceIds });
		builder.andWhere(
			new Brackets((qb) => {
				for (const id of employeeIds) {
					qb.andWhere(`employees.id = ${id}`);
				}
			}),
		);
		builder.groupBy('e.id');
		return builder.getMany();
	}

	async addTag(serviceId: number, tagId: number, userId: number) {
		const entity = await this.getService({ id: serviceId }, userId);
		const tag = await this.tagsService.getTag(tagId, userId);
		if (entity) {
			if (tag) {
				entity.tags = [...entity.tags, tag];
				return this.repository.save(entity);
			}
			throw new NotFoundException('tag.not.found');
		}
		throw new NotFoundException('service.not.found');
	}

	async removeTag(serviceId: number, tagId: number, userId: number) {
		const entity = await this.getService({ id: serviceId }, userId);
		if (entity) {
			entity.tags = entity.tags.filter(({ id }) => id !== tagId);
			return this.repository.save(entity);
		}
		throw new NotFoundException('service.not.found');
	}
}
