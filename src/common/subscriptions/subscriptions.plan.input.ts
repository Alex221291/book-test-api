import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { CurrencyTypes } from '../../base/types/currency.enum';

@InputType('SubscriptionsPlanInput')
export class SubscriptionsPlanInput {
	@Field()
	title: string;

	@Field(() => Float)
	price: number;

	@Field(() => CurrencyTypes)
	currency: CurrencyTypes;

	@Field(() => Int)
	validity: number;

	@Field()
	unit: string;

	@Field()
	activationType: string;

	@Field(() => Int)
	visits: number;

	@Field(() => [Int])
	serviceIds: number[];
}
