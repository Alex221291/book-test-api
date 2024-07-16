import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { GroupsEntity } from './groups.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService extends BaseService<GroupsEntity> {
	constructor(
		@InjectRepository(GroupsEntity)
		protected repository: Repository<GroupsEntity>,
	) {
		super();
	}
}
