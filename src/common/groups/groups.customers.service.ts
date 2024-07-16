import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupsCustomersEntity } from './groups.customers.entity';

@Injectable()
export class GroupsCustomersService extends BaseService<GroupsCustomersEntity> {
	constructor(
		@InjectRepository(GroupsCustomersEntity)
		protected repository: Repository<GroupsCustomersEntity>,
	) {
		super();
	}
}
