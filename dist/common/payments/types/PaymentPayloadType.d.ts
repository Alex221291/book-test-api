export type PaymentPayloadType = {
    type: 'incoming' | 'outcoming';
    account_key: 'account' | 'card' | 'cash';
    purpose: string;
    details?: string;
    userId: number;
    amount: number;
};
