import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('EmployeeInput')
export class EmployeeInput {
	@Field(() => Int, { nullable: true })
	id: number;

	@Field(() => Int, { nullable: true })
	officeId: number;

	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field({ nullable: true })
	photo?: string;

	@Field({ nullable: true })
	phone: string;

	@Field(() => Int, { nullable: true })
	rate?: number;

	@Field()
	jobTitle: string;

	@Field(() => [Int], { nullable: true })
	services?: Array<number>;
}
