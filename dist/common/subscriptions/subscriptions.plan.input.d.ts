import { CurrencyTypes } from '../../base/types/currency.enum';
export declare class SubscriptionsPlanInput {
    title: string;
    price: number;
    currency: CurrencyTypes;
    validity: number;
    unit: string;
    activationType: string;
    visits: number;
    serviceIds: number[];
}
