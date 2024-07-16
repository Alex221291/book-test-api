import { registerEnumType } from '@nestjs/graphql';

export enum CurrencyTypes {
	BYN = 'BYN',
	RUB = 'RUB',
	EUR = 'EUR',
	USD = 'USD',
}

registerEnumType(CurrencyTypes, {
	name: 'CurrencyTypes',
});
