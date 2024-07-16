import { FindManyOptions } from 'typeorm';
import { BaseEntity } from './base.entity';
export interface BaseServiceInterface<T> {
    add: (createInput: BaseEntity<T>) => Promise<T | boolean>;
    update: (updateInput: BaseEntity<T>) => Promise<T | boolean>;
    remove: (id: number) => Promise<void>;
    findAll: () => Promise<T[]>;
    findAllBy: (options: FindManyOptions<T>) => Promise<T[]>;
    findOneBy: (options: FindManyOptions<T>) => Promise<T>;
    findOneById: (id: number) => Promise<T>;
}
