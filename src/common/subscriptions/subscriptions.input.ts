import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('SubscriptionsInput')
export class SubscriptionsInput {
	@Field(() => Int)
	customer: number;

	@Field(() => Int)
	plan: number;

	@Field()
	sinceDate: string;

	@Field({ nullable: true })
	untilDate?: string;
}
