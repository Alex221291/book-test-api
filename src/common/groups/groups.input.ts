import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('GroupsInput')
export class GroupsInput {
	@Field()
	title: string;

	@Field(() => Date)
	sinceDate: Date;

	@Field(() => Date)
	untilDate: Date;

	@Field(() => Int)
	serviceId: number;

	@Field(() => Int)
	officeId: number;
}
