import { CustomerEntity } from './customer.entity';
declare const CustomerInput_base: import("@nestjs/common").Type<Partial<CustomerEntity>>;
export declare class CustomerInput extends CustomerInput_base {
    phone: string;
    firstName?: string;
    lastName?: string;
    loyalty?: string;
    blocked?: number;
    gender?: string;
    notes?: string;
    birthday?: Date;
}
export {};
