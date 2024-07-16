import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType('CompanyInput')
export class CompanyInput {
	@Field()
	@IsNotEmpty()
	title: string;

	@Field()
	@IsNotEmpty()
	address: string;

	@Field()
	@IsNotEmpty()
	timezone: string;

	@Field({ nullable: true })
	regNumber?: string;

	@Field()
	@IsNotEmpty()
	phone: string;

	user: number;

	@Field({ nullable: true })
	logo?: string;

	@Field({ nullable: true })
	description?: string;
}
