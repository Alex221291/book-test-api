import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { SubscriptionsPlanEntity } from './subscriptions.plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsPlanService extends BaseService<SubscriptionsPlanEntity> {
	constructor(
		@InjectRepository(SubscriptionsPlanEntity)
		protected repository: Repository<SubscriptionsPlanEntity>,
	) {
		super();
	}

	async getSubscriptionsPlanById(
		userId: number,
		companyId: string,
		id: number,
	) {
		const builder = this.repository.createQueryBuilder('e');
		builder
			.leftJoinAndSelect('e.company', 'company')
			.leftJoinAndSelect('e.services', 'service')
			.leftJoinAndSelect('company.users', 'users');
		builder
			.andWhere(`e.archived is FALSE`)
			.andWhere(`e.id = ${id}`)
			.andWhere(`users.id IN(${userId})`)
			.andWhere(`company.hash = '${companyId}'`);
		return await builder.getOne();
	}
}
