import { BaseService } from '../../base/base.service';
import { Repository } from 'typeorm';
import { GroupsCustomersEntity } from './groups.customers.entity';
export declare class GroupsCustomersService extends BaseService<GroupsCustomersEntity> {
    protected repository: Repository<GroupsCustomersEntity>;
    constructor(repository: Repository<GroupsCustomersEntity>);
}
