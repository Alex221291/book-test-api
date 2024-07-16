import { BaseEntity } from 'typeorm';
export declare class FileEntity extends BaseEntity {
    id: number;
    filename: string;
    dir: string;
    size: number;
    type: string;
    createdAt: Date;
    constructor();
}
