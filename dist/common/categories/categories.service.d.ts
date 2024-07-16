import { BaseService } from '../../base/base.service';
import { CategoriesEntity } from './categories.entity';
import { Repository } from 'typeorm';
export declare class CategoriesService extends BaseService<CategoriesEntity> {
    protected repository: Repository<CategoriesEntity>;
    constructor(repository: Repository<CategoriesEntity>);
}
