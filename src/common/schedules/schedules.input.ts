import { Field, InputType, Int } from '@nestjs/graphql';
import { SchedulesType } from './types/schedules.type';

@InputType('ScheduleInput')
export class ScheduleInput {
	@Field(() => Int, { nullable: true })
	id?: number;

	@Field()
	sinceDate: string;

	@Field({ nullable: true })
	untilDate?: string;

	@Field(() => [Int], { nullable: true })
	services?: number[];

	@Field(() => Int, { nullable: true })
	extraDuration?: number;

	@Field(() => Int, { nullable: true })
	groupId?: number;

	@Field(() => Int, { nullable: true })
	employee: number;

	@Field(() => Int, { nullable: true })
	bookingId?: number;

	@Field(() => SchedulesType, {
		nullable: true,
		defaultValue: SchedulesType.DEFAULT,
	})
	type?: SchedulesType;
}
