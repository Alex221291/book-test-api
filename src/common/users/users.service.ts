import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { BaseService } from '../../base/base.service';

@Injectable()
export class UsersService extends BaseService<UserEntity> {
	constructor(
		@InjectRepository(UserEntity)
		protected repository: Repository<UserEntity>,
	) {
		super();
	}

	findAll(options = {}): Promise<UserEntity[]> {
		return super.findAll({
			...options,
		});
	}
}
