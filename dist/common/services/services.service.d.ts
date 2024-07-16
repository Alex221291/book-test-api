import { ServiceEntity } from './services.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { ServiceInput } from './services.input';
import { CompanyEntity } from '../companies/companies.entity';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';
export declare class ServicesService extends BaseService<ServiceEntity> {
    protected repository: Repository<ServiceEntity>;
    private readonly categoriesService;
    private readonly tagsService;
    constructor(repository: Repository<ServiceEntity>, categoriesService: CategoriesService, tagsService: TagsService);
    prepare(payload: ServiceInput, entity: ServiceEntity, company: CompanyEntity): Promise<ServiceEntity>;
    getService(where: FindOptionsWhere<ServiceEntity>, userId: number): Promise<ServiceEntity>;
    findAll(options?: FindManyOptions<ServiceEntity>): Promise<ServiceEntity[]>;
    findServicesByIds(employeeIds: number[], serviceIds: number[]): Promise<ServiceEntity[]>;
    addTag(serviceId: number, tagId: number, userId: number): Promise<ServiceEntity>;
    removeTag(serviceId: number, tagId: number, userId: number): Promise<ServiceEntity>;
}
