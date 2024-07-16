import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('GroupsCustomersInput')
export class GroupsCustomersInput {
	@Field(() => Int)
	customer: number;

	@Field(() => Int)
	group: number;
}
