import { CurrencyTypes } from '../../base/types/currency.enum';
export declare class ServiceInput {
    title: string;
    category?: string;
    description?: string;
    weight: number;
    duration: number;
    price: number;
    maxPrice?: number;
    currency: CurrencyTypes;
}
