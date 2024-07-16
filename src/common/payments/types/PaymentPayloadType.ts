export type PaymentPayloadType = {
	type: 'incoming' | 'outcoming';
	account_key: 'account' | 'card' | 'cash';
	purpose: string; // booking.service.fee, balance.upcoming, booking.payment, subscription.fee, sms.fee
	details?: string;
	userId: number;
	amount: number;
};
