import { UserEntity } from '../users/users.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import { WebFormService } from './webform.service';
import { WebFormEntity } from './webform.entity';
import WebFormPaginatedResponse from './types/webform.paginate';
import { WebFormInput } from './webform.input';
import { EmployeesService } from '../employees/employees.service';
export declare class WebFormResolver {
    private readonly service;
    private readonly employeesService;
    constructor(service: WebFormService, employeesService: EmployeesService);
    getAllWebForms(user: UserEntity, companyId: string, filters: FiltersExpression[], sorters?: SorterType[], offset?: number, limit?: number): Promise<WebFormPaginatedResponse>;
    getWebFormById(user: UserEntity, id: number): Promise<WebFormEntity>;
    getWebForm(hash: string): Promise<WebFormEntity>;
    addWebForm(user: UserEntity, payload: WebFormInput): Promise<WebFormEntity>;
    updateWebForm(user: UserEntity, id: number, payload: WebFormInput): Promise<WebFormEntity>;
    removeWebForm(user: UserEntity, id: number): Promise<WebFormEntity>;
}
