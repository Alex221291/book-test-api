import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { BaseService } from '../../base/base.service';
export declare class UsersService extends BaseService<UserEntity> {
    protected repository: Repository<UserEntity>;
    constructor(repository: Repository<UserEntity>);
    findAll(options?: {}): Promise<UserEntity[]>;
}
