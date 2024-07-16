import { BaseService } from '../../base/base.service';
import { OfficesEntity } from './offices.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
export declare class OfficesService extends BaseService<OfficesEntity> {
    protected repository: Repository<OfficesEntity>;
    constructor(repository: Repository<OfficesEntity>);
    getOfficeWorkTime(officeId: number, date: DateTime): Promise<any[]>;
}
