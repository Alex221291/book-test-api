import { BaseService } from '../../base/base.service';
import { PlansEntity } from './plans.entity';
import { Repository } from 'typeorm';
export declare class PlansService extends BaseService<PlansEntity> {
    protected repository: Repository<PlansEntity>;
    constructor(repository: Repository<PlansEntity>);
}
