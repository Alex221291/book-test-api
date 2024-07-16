import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { EmployeeEntity } from './employees.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class EmployeesService extends BaseService<EmployeeEntity> {
	constructor(
		@InjectRepository(EmployeeEntity)
		protected repository: Repository<EmployeeEntity>,
	) {
		super();
	}

	findAll(
		options?: FindManyOptions<EmployeeEntity>,
	): Promise<EmployeeEntity[]> {
		return super.findAll({
			...options,
		});
	}

	getEmployeeById(
		id: number,
		company: string,
		serviceIds?: number[],
		userId?: number,
	): Promise<EmployeeEntity> {
		const builder = this.repository.createQueryBuilder('e');
		builder
			.leftJoinAndSelect('e.office', 'office')
			.leftJoinAndSelect('e.services', 'services')
			.leftJoinAndSelect('office.company', 'company')
			.leftJoinAndSelect('company.users', 'users')
			.andWhere('company.hash = :hash', { hash: company })
			.andWhere(`e.id = :id`, { id });
		if (serviceIds) {
			builder.andWhere('services.id IN (:serviceIds)', { serviceIds });
		}
		if (userId) {
			builder.andWhere('users.id IN (:user)', { user: userId });
		}
		return builder.getOne();
	}
}
