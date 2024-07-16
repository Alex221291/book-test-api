import { BaseService } from '../../base/base.service';
import { TagsEntity } from './tags.entity';
import { Repository } from 'typeorm';
import { TagsInput } from './tags.input';
import { CompanyEntity } from '../companies/companies.entity';
export declare class TagsService extends BaseService<TagsEntity> {
    protected repository: Repository<TagsEntity>;
    constructor(repository: Repository<TagsEntity>);
    prepare(entity: TagsEntity, payload: TagsInput, company: CompanyEntity): Promise<TagsEntity>;
    getTag(id: number, userId: number): Promise<TagsEntity>;
}
