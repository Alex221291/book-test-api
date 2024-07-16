import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { TagsEntity } from './tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsInput } from './tags.input';
import { CompanyEntity } from '../companies/companies.entity';

@Injectable()
export class TagsService extends BaseService<TagsEntity> {
	constructor(
		@InjectRepository(TagsEntity)
		protected repository: Repository<TagsEntity>,
	) {
		super();
	}

	async prepare(
		entity: TagsEntity,
		payload: TagsInput,
		company: CompanyEntity,
	): Promise<TagsEntity> {
		entity.title = payload.title;
		entity.color = payload.color;
		entity.company = company;
		return this.repository.merge(entity, payload);
	}

	async getTag(id: number, userId: number) {
		return await this.repository.findOneBy({
			id,
			company: {
				users: {
					id: userId,
				},
			},
		});
	}
}
