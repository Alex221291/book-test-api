import { BaseService } from '../../base/base.service';
import { EmployeeEntity } from './employees.entity';
import { FindManyOptions, Repository } from 'typeorm';
export declare class EmployeesService extends BaseService<EmployeeEntity> {
    protected repository: Repository<EmployeeEntity>;
    constructor(repository: Repository<EmployeeEntity>);
    findAll(options?: FindManyOptions<EmployeeEntity>): Promise<EmployeeEntity[]>;
    getEmployeeById(id: number, company: string, serviceIds?: number[], userId?: number): Promise<EmployeeEntity>;
}
