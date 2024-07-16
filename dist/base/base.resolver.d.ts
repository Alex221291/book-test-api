import { BaseEntity } from './base.entity';
import { BaseServiceInterface } from './base.service.interface';
export declare class BaseResolver<T> {
    protected service: BaseServiceInterface<T>;
    constructor(service: BaseServiceInterface<T>);
    add(entity: BaseEntity<T>): Promise<boolean | T>;
    update(entity: BaseEntity<T>): Promise<boolean | T>;
    remove(id: number): Promise<void>;
    getAll(): Promise<T[]>;
}
