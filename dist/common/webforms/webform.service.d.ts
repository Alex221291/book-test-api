import { BaseService } from '../../base/base.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { WebFormEntity } from './webform.entity';
import { WebFormInput } from './webform.input';
import { OfficesService } from '../offices/offices.service';
import { EmployeesService } from '../employees/employees.service';
import { ServicesService } from '../services/services.service';
import { UserEntity } from '../users/users.entity';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import WebFormPaginatedResponse from './types/webform.paginate';
export declare class WebFormService extends BaseService<WebFormEntity> {
    protected readonly repository: Repository<WebFormEntity>;
    private readonly officesService;
    private readonly employeesService;
    private readonly servicesService;
    constructor(repository: Repository<WebFormEntity>, officesService: OfficesService, employeesService: EmployeesService, servicesService: ServicesService);
    prepare(entity: WebFormEntity, payload: WebFormInput, userId: number): Promise<WebFormEntity>;
    getWebFormList(userIds: number[], companyId: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<WebFormPaginatedResponse>;
    getWebFormByHash(hash: string): Promise<WebFormEntity>;
    getWebForm(where: FindOptionsWhere<WebFormEntity>, user: UserEntity): Promise<WebFormEntity>;
}
