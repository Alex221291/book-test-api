import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CurrencyTypes } from '../../base/types/currency.enum';

@InputType('ServiceInput')
export class ServiceInput {
	@Field()
	@IsNotEmpty()
	title: string;

	@Field({ nullable: true })
	category?: string;

	@Field({ nullable: true })
	description?: string;

	@Field(() => Int)
	weight: number;

	@Field(() => Int)
	@IsNotEmpty()
	duration: number;

	@Field()
	@IsNotEmpty()
	price: number;

	@Field({ nullable: true })
	maxPrice?: number;

	@Field(() => CurrencyTypes)
	@IsNotEmpty()
	currency: CurrencyTypes;
}
