import { CompanyEntity } from './companies.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { UserEntity } from '../users/users.entity';
export declare class CompaniesService extends BaseService<CompanyEntity> {
    protected repository: Repository<CompanyEntity>;
    constructor(repository: Repository<CompanyEntity>);
    findAll(options?: FindManyOptions<CompanyEntity>): Promise<CompanyEntity[]>;
    getCompanyByUser(companyId: string, user: UserEntity): Promise<CompanyEntity>;
}
