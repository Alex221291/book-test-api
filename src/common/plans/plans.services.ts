import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { PlansEntity } from './plans.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlansService extends BaseService<PlansEntity> {
	constructor(
		@InjectRepository(PlansEntity)
		protected repository: Repository<PlansEntity>,
	) {
		super();
	}
}
