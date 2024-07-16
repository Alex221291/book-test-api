import { BaseService } from '../../base/base.service';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';
export declare class FileService extends BaseService<FileEntity> {
    protected repository: Repository<FileEntity>;
    constructor(repository: Repository<FileEntity>);
}
