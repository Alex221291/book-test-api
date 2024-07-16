import { Injectable } from '@nestjs/common';
import { CompanyEntity } from './companies.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { UserEntity } from '../users/users.entity';

@Injectable()
export class CompaniesService extends BaseService<CompanyEntity> {
	constructor(
		@InjectRepository(CompanyEntity)
		protected repository: Repository<CompanyEntity>,
	) {
		super();
	}

	findAll(options?: FindManyOptions<CompanyEntity>): Promise<CompanyEntity[]> {
		return super.findAll({
			...options,
		});
	}

	getCompanyByUser(companyId: string, user: UserEntity) {
		return this.findOneBy({
			hash: companyId,
			users: {
				id: user.id,
			},
		});
	}
}
