import { BaseService } from '../../base/base.service';
import { GroupsEntity } from './groups.entity';
import { Repository } from 'typeorm';
export declare class GroupsService extends BaseService<GroupsEntity> {
    protected repository: Repository<GroupsEntity>;
    constructor(repository: Repository<GroupsEntity>);
}
