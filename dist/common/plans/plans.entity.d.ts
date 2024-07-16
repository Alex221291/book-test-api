import { BaseEntity } from 'typeorm';
import { CurrencyTypes } from '../../base/types/currency.enum';
import { UserEntity } from '../users/users.entity';
export declare class PlansEntity extends BaseEntity {
    id: number;
    title: string;
    code: string;
    level: number;
    ordersLimit: number;
    profit: number;
    superProfit: number;
    currency: CurrencyTypes;
    users: UserEntity[];
}
