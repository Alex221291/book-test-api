import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { CategoriesEntity } from './categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService extends BaseService<CategoriesEntity> {
	constructor(
		@InjectRepository(CategoriesEntity)
		protected repository: Repository<CategoriesEntity>,
	) {
		super();
	}
}
