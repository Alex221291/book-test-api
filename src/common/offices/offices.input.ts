import { Field, InputType } from '@nestjs/graphql';

@InputType('OfficeInput')
export class OfficesInput {
	@Field()
	title: string;

	@Field()
	address: string;

	@Field()
	phone: string;

	@Field({ nullable: true })
	workingDays?: string;
}
